export const QUICK_FILTER_PRESETS = [
  {
    id: 'small_models',
    label: 'Small Models',
    shortDescription: '1.7B-7B parameters',
    description: 'Lightweight models optimized for devices with limited resources. Ideal for mobile deployment or edge computing environments.',
    filters: {
      paramsRange: [1.7, 7],
      selectedBooleanFilters: ['is_for_edge_devices']
    }
  },
  {
    id: 'medium_models',
    label: 'Medium Models',
    shortDescription: '7B-70B parameters',
    description: 'Good balance between performance and required resources. Recommended for most use cases and standard server deployments.',
    filters: {
      paramsRange: [7, 70],
      selectedBooleanFilters: []
    }
  },
  {
    id: 'large_models',
    label: 'Large Models',
    shortDescription: '70B+ parameters',
    description: 'Large-scale models offering the best performance but requiring significant resources. Ideal for applications requiring high accuracy with adapted infrastructure.',
    filters: {
      paramsRange: [70, 140],
      selectedBooleanFilters: []
    }
  },
  {
    id: 'official_providers',
    label: 'Only Official Providers',
    shortDescription: 'Officially provided models',
    description: 'Models that are officially provided and maintained by their original creators or organizations.',
    filters: {
      selectedBooleanFilters: ['is_highlighted_by_maintainer']
    }
  }
]; 