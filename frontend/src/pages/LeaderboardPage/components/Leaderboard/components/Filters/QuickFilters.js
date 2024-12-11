import React, { useCallback, useMemo } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { QUICK_FILTER_PRESETS } from "../../constants/quickFilters";
import FilterTag from "../../../../../../components/shared/FilterTag";
import { useLeaderboard } from "../../context/LeaderboardContext";
import InfoIconWithTooltip from "../../../../../../components/shared/InfoIconWithTooltip";
import { UI_TOOLTIPS } from "../../constants/tooltips";

export const QuickFiltersSkeleton = () => (
  <Box sx={{ width: "100%" }}>
    <Box
      sx={{
        backgroundColor: (theme) => ({
          xs: alpha(theme.palette.primary.main, 0.02),
          lg: "transparent",
        }),
        borderColor: (theme) => ({
          xs: alpha(theme.palette.primary.main, 0.2),
          lg: "transparent",
        }),
        border: "1px solid",
        borderRadius: 1,
        p: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "column", lg: "row" },
        gap: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          mb: { xs: 1, md: 2, lg: 0 },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "text.secondary",
          }}
        >
          Quick Filters
        </Typography>
        <InfoIconWithTooltip
          tooltip={UI_TOOLTIPS.QUICK_FILTERS}
          iconProps={{ sx: { fontSize: "1rem" } }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1,
          width: "100%",
          "& > *": {
            flex: { md: 1 },
          },
        }}
      >
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            width={{ xs: "100%", md: "auto" }}
            height={32}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>
      <Skeleton
        width={{ xs: "100%", md: 150 }}
        height={32}
        sx={{ borderRadius: 1 }}
      />
    </Box>
  </Box>
);

const QuickFilters = ({ totalCount = 0, loading = false }) => {
  const { state, actions } = useLeaderboard();
  const { normal: filterCounts, officialOnly: officialOnlyCounts } =
    state.filterCounts;
  const isOfficialProviderActive = state.filters.isOfficialProviderActive;
  const currentParams = state.filters.paramsRange;

  const currentCounts = useMemo(
    () => (isOfficialProviderActive ? officialOnlyCounts : filterCounts),
    [isOfficialProviderActive, officialOnlyCounts, filterCounts]
  );

  const modelSizePresets = useMemo(
    () =>
      QUICK_FILTER_PRESETS.filter(
        (preset) => preset.id !== "official_providers"
      ),
    []
  );

  const officialProvidersPreset = useMemo(
    () =>
      QUICK_FILTER_PRESETS.find((preset) => preset.id === "official_providers"),
    []
  );

  const handleSizePresetClick = useCallback(
    (preset) => {
      const isActive =
        currentParams[0] === preset.filters.paramsRange[0] &&
        currentParams[1] === preset.filters.paramsRange[1];

      if (isActive) {
        actions.setFilter("paramsRange", [-1, 140]); // Reset to default
      } else {
        actions.setFilter("paramsRange", preset.filters.paramsRange);
      }
    },
    [currentParams, actions]
  );

  const getPresetCount = useCallback(
    (preset) => {
      const range = preset.id.split("_")[0];
      return currentCounts.parameterRanges[range] || 0;
    },
    [currentCounts]
  );

  const handleOfficialProviderToggle = useCallback(() => {
    actions.toggleOfficialProvider();
  }, [actions]);

  if (loading) {
    return <QuickFiltersSkeleton />;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          backgroundColor: (theme) => ({
            xs: alpha(theme.palette.primary.main, 0.02),
            lg: "transparent",
          }),
          borderColor: (theme) => ({
            xs: alpha(theme.palette.primary.main, 0.2),
            lg: "transparent",
          }),
          border: "1px solid",
          borderRadius: 1,
          p: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "column", lg: "row" },
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: { xs: 1, md: 2, lg: 0 },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Quick Filters
          </Typography>
          <InfoIconWithTooltip
            tooltip={UI_TOOLTIPS.QUICK_FILTERS}
            iconProps={{ sx: { fontSize: "1rem" } }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "column", lg: "row" },
            gap: 2,
            flex: 1,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 1,
              width: "100%",
              "& > *": {
                flex: { md: 1 },
              },
            }}
          >
            {modelSizePresets.map((preset) => (
              <FilterTag
                key={preset.id}
                label={preset.label}
                checked={
                  currentParams[0] === preset.filters.paramsRange[0] &&
                  currentParams[1] === preset.filters.paramsRange[1]
                }
                onChange={() => handleSizePresetClick(preset)}
                count={getPresetCount(preset)}
                totalCount={totalCount}
                sx={{
                  width: { xs: "100%", md: "auto" },
                }}
              />
            ))}
          </Box>

          {officialProvidersPreset && (
            <FilterTag
              label={officialProvidersPreset.label}
              checked={isOfficialProviderActive}
              onChange={handleOfficialProviderToggle}
              count={currentCounts.maintainersHighlight}
              totalCount={totalCount}
              showCheckbox={true}
              variant="secondary"
              sx={{ width: { xs: "100%", md: "100%", lg: "auto" } }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

QuickFilters.displayName = "QuickFilters";

export default React.memo(QuickFilters);
