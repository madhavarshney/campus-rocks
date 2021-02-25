const { promises: fs } = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const dataDirectory = path.join(process.cwd(), 'data')

export async function getCampusInfo() {
  return {
    name: 'Foothill College',
    shortName: 'Foothill',
    openCourseId: 'fh',
  }
}

export async function getClubsInfo() {
  return yaml.load(
    await fs.readFile(path.join(dataDirectory, 'clubs.yaml'), 'utf8')
  )
}

export async function getCommunitiesInfo() {
  const data = yaml.load(
    await fs.readFile(path.join(dataDirectory, 'communities.yaml'), 'utf8')
  )

  return data.communities
}
