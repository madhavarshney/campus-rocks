const { promises: fs } = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const dataDirectory = path.join(process.cwd(), 'data')

async function loadYaml(filename) {
  return yaml.load(
    await fs.readFile(path.join(dataDirectory, filename), 'utf8')
  )
}

export const getCampusInfo = async () => loadYaml('campus.yaml')
export const getClubsInfo = async () => loadYaml('clubs.yaml')
export const getCommunitiesInfo = async () =>
  (await loadYaml('communities.yaml')).communities
