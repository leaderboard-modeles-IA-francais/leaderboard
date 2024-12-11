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
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        gap: 2,
        width: "100%",
        minHeight: { xs: "auto", md: "48px" },
        py: 1,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: { xs: "100%", md: "auto" },
          mb: { xs: 1, md: 0 },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "text.secondary",
            whiteSpace: "nowrap",
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
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          flex: 1,
          width: { xs: "100%", md: "auto" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 0.5,
            flexWrap: { xs: "nowrap", md: "nowrap" },
            borderRight: {
              xs: "none",
              md: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            },
            borderBottom: {
              xs: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              md: "none",
            },
            pr: { xs: 0, md: 2 },
            pb: { xs: 2, md: 0 },
            mr: 0,
          }}
        >
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              width={120}
              height={32}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
        <Skeleton width={150} height={32} sx={{ borderRadius: 1 }} />
      </Box>
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
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          transition: (theme) =>
            theme.transitions.create(["border-color", "background-color"], {
              duration: theme.transitions.duration.short,
            }),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 1.5,
            mr: 2,
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
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { xs: "stretch", lg: "center" },
            gap: 2,
            flex: 1,
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 0.5,
              flexWrap: { xs: "nowrap", lg: "nowrap" },
              borderRight: {
                xs: "none",
                md: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              },
              borderBottom: {
                xs: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                md: "none",
              },
              pr: { xs: 0, md: 2 },
              pb: { xs: 2, md: 0 },
              mr: 0,
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
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

QuickFilters.displayName = "QuickFilters";

export default React.memo(QuickFilters);
