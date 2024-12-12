import { useMemo } from "react";
import {
  looksLikeRegex,
  parseSearchQuery,
  getValueByPath,
} from "../utils/searchUtils";

// Calculate min/max averages
export const useAverageRange = (data) => {
  return useMemo(() => {
    const averages = data.map((item) => item.model.average_score);
    return {
      minAverage: Math.min(...averages),
      maxAverage: Math.max(...averages),
    };
  }, [data]);
};

// Generate colors for scores
export const useColorGenerator = (minAverage, maxAverage) => {
  return useMemo(() => {
    const colorCache = new Map();
    return (value) => {
      const cached = colorCache.get(value);
      if (cached) return cached;

      const normalizedValue = (value - minAverage) / (maxAverage - minAverage);
      const red = Math.round(255 * (1 - normalizedValue) * 1);
      const green = Math.round(255 * normalizedValue) * 1;
      const color = `rgba(${red}, ${green}, 0, 1)`;
      colorCache.set(value, color);
      return color;
    };
  }, [minAverage, maxAverage]);
};

// Process data with boolean standardization
export const useProcessedData = (data, averageMode, visibleColumns) => {
  return useMemo(() => {
    let processed = data.map((item) => {
      const evaluationScores = Object.entries(item.evaluations)
        .filter(([key]) => {
          if (averageMode === "all") return true;
          return visibleColumns.includes(`evaluations.${key}.normalized_score`);
        })
        .map(([, value]) => value.normalized_score);

      const average =
        evaluationScores.length > 0
          ? evaluationScores.reduce((a, b) => a + b, 0) /
            evaluationScores.length
          : averageMode === "visible"
          ? null
          : 0;

      // Boolean standardization
      const standardizedFeatures = {
        ...item.features,
        is_moe: Boolean(item.features.is_moe),
        is_flagged: Boolean(item.features.is_flagged),
        is_highlighted_by_maintainer: Boolean(
          item.features.is_highlighted_by_maintainer
        ),
        is_merged: Boolean(item.features.is_merged),
        is_not_available_on_hub: Boolean(item.features.is_not_available_on_hub),
      };

      return {
        ...item,
        features: standardizedFeatures,
        model: {
          ...item.model,
          has_chat_template: Boolean(item.model.has_chat_template),
          average_score: average,
        },
      };
    });

    processed.sort((a, b) => {
      if (a.model.average_score === null && b.model.average_score === null)
        return 0;
      if (a.model.average_score === null) return 1;
      if (b.model.average_score === null) return -1;
      return b.model.average_score - a.model.average_score;
    });

    return processed.map((item, index) => ({
      ...item,
      static_rank: index + 1,
    }));
  }, [data, averageMode, visibleColumns]);
};

// Common filtering logic
export const useFilteredData = (
  processedData,
  selectedPrecisions,
  selectedTypes,
  paramsRange,
  searchValue,
  selectedBooleanFilters,
  rankingMode,
  pinnedModels = [],
  isOfficialProviderActive = false
) => {
  return useMemo(() => {
    const pinnedData = processedData.filter((row) => {
      return pinnedModels.includes(row.id);
    });
    const unpinnedData = processedData.filter((row) => {
      return !pinnedModels.includes(row.id);
    });

    let filteredUnpinned = unpinnedData;

    // Filter by official providers
    if (isOfficialProviderActive) {
      filteredUnpinned = filteredUnpinned.filter(
        (row) =>
          row.features?.is_highlighted_by_maintainer ||
          row.metadata?.is_highlighted_by_maintainer
      );
    }

    // Filter by precision
    if (selectedPrecisions.length > 0) {
      filteredUnpinned = filteredUnpinned.filter((row) =>
        selectedPrecisions.includes(row.model.precision)
      );
    }

    // Filter by type
    if (selectedTypes.length > 0) {
      filteredUnpinned = filteredUnpinned.filter((row) => {
        const modelType = row.model.type?.toLowerCase().trim();
        return selectedTypes.some((type) => modelType?.includes(type));
      });
    }

    // Filter by parameters
    filteredUnpinned = filteredUnpinned.filter((row) => {
      // Skip parameter filtering if no filter is active
      if (paramsRange[0] === -1 && paramsRange[1] === 140) return true;

      const params =
        row.metadata?.params_billions || row.features?.params_billions;
      if (params === undefined || params === null) return false;
      return params >= paramsRange[0] && params < paramsRange[1];
    });

    // Filter by search
    if (searchValue) {
      const searchQueries = searchValue
        .split(";")
        .map((q) => q.trim())
        .filter((q) => q);
      if (searchQueries.length > 0) {
        filteredUnpinned = filteredUnpinned.filter((row) => {
          return searchQueries.some((query) => {
            const { specialSearches, textSearch } = parseSearchQuery(query);

            const specialSearchMatch = specialSearches.every(
              ({ field, value }) => {
                const fieldValue = getValueByPath(row, field)
                  ?.toString()
                  .toLowerCase();
                return fieldValue?.includes(value.toLowerCase());
              }
            );

            if (!specialSearchMatch) return false;
            if (!textSearch) return true;

            const modelName = row.model.name.toLowerCase();
            const searchLower = textSearch.toLowerCase();

            if (looksLikeRegex(textSearch)) {
              try {
                const regex = new RegExp(textSearch, "i");
                return regex.test(modelName);
              } catch (e) {
                return modelName.includes(searchLower);
              }
            } else {
              return modelName.includes(searchLower);
            }
          });
        });
      }
    }

    // Filter by booleans
    if (selectedBooleanFilters.length > 0) {
      filteredUnpinned = filteredUnpinned.filter((row) => {
        return selectedBooleanFilters.every((filter) => {
          const filterValue =
            typeof filter === "object" ? filter.value : filter;

          // Maintainer's Highlight keeps positive logic
          if (filterValue === "is_highlighted_by_maintainer") {
            return row.features[filterValue];
          }

          // For all other filters, invert the logic
          if (filterValue === "is_not_available_on_hub") {
            return row.features[filterValue];
          }

          return !row.features[filterValue];
        });
      });
    }

    // Create ordered array of pinned models respecting pinnedModels order
    const orderedPinnedData = pinnedModels
      .map((pinnedModelId) =>
        pinnedData.find((item) => item.id === pinnedModelId)
      )
      .filter(Boolean);

    // Combine all filtered data
    const allFilteredData = [...filteredUnpinned, ...orderedPinnedData];

    // Sort all data by average_score for dynamic_rank
    const sortedByScore = [...allFilteredData].sort((a, b) => {
      // Si les scores moyens sont différents, trier par score
      if (a.model.average_score !== b.model.average_score) {
        if (a.model.average_score === null && b.model.average_score === null)
          return 0;
        if (a.model.average_score === null) return 1;
        if (b.model.average_score === null) return -1;
        return b.model.average_score - a.model.average_score;
      }

      // Si les scores sont égaux, comparer le nom du modèle et la date de soumission
      if (a.model.name === b.model.name) {
        // Si même nom, trier par date de soumission (la plus récente d'abord)
        const dateA = new Date(a.metadata?.submission_date || 0);
        const dateB = new Date(b.metadata?.submission_date || 0);
        return dateB - dateA;
      }

      // Si noms différents, trier par nom
      return a.model.name.localeCompare(b.model.name);
    });

    // Create Map to store dynamic_ranks
    const dynamicRankMap = new Map();
    sortedByScore.forEach((item, index) => {
      dynamicRankMap.set(item.id, index + 1);
    });

    // Add ranks to final data
    const finalData = [...orderedPinnedData, ...filteredUnpinned].map(
      (item) => {
        return {
          ...item,
          dynamic_rank: dynamicRankMap.get(item.id),
          rank: item.isPinned
            ? pinnedModels.indexOf(item.id) + 1
            : rankingMode === "static"
            ? item.static_rank
            : dynamicRankMap.get(item.id),
          isPinned: pinnedModels.includes(item.id),
        };
      }
    );

    return finalData;
  }, [
    processedData,
    selectedPrecisions,
    selectedTypes,
    paramsRange,
    searchValue,
    selectedBooleanFilters,
    rankingMode,
    pinnedModels,
    isOfficialProviderActive,
  ]);
};

// Column visibility management
export const useColumnVisibility = (visibleColumns = []) => {
  // Create secure visibility object
  const columnVisibility = useMemo(() => {
    // Check visible columns
    const safeVisibleColumns = Array.isArray(visibleColumns)
      ? visibleColumns
      : [];

    const visibility = {};
    try {
      safeVisibleColumns.forEach((columnKey) => {
        if (typeof columnKey === "string") {
          visibility[columnKey] = true;
        }
      });
    } catch (error) {
      console.warn("Error in useColumnVisibility:", error);
    }
    return visibility;
  }, [visibleColumns]);

  return columnVisibility;
};
