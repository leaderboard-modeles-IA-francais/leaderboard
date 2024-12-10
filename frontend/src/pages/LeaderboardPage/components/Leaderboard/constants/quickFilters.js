export const QUICK_FILTER_PRESETS = [
  {
    id: 'edge_device',
    label: 'Edge Device Models',
    shortDescription: 'Up to 3B parameters',
    description: 'Lightweight models optimized for edge devices with limited resources. Ideal for mobile deployment or edge computing environments.',
    filters: {
      paramsRange: [0, 3],
      selectedBooleanFilters: ['is_for_edge_devices']
    }
  },
  {
    id: 'small_models',
    label: 'SmolLMs',
    shortDescription: 'Up to 7B parameters',
    description: 'Lightweight models optimized for consumer hardware with up to one GPU. Ideal for private consumer hardware.',
    filters: {
      paramsRange: [0, 7],
      selectedBooleanFilters: ['is_for_edge_devices']
    }
  },
  {
    id: 'medium_models',
    label: 'Middle ground models',
    shortDescription: '7B-65B parameters',
    description: 'Overall balance between performance and required resources.',
    filters: {
      paramsRange: [7, 70],
      selectedBooleanFilters: []
    }
  },
  {
    id: 'large_models',
    label: 'GPU-rich Models',
    shortDescription: '65B+ parameters',
    description: 'Large-scale models offering (in theory) the best performance but requiring significant resources. Requires adapted infrastructure.',
    filters: {
      paramsRange: [85, 140],
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