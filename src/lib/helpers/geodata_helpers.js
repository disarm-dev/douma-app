import cache from 'config/cache'

export function get_geodata_for_level_name(level_name) {
  return cache.geodata[level_name]
}