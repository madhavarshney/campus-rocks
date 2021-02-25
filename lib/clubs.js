const { promises: fs } = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const dataDirectory = path.join(process.cwd(), 'data')

export async function getClubsInfo() {
  return yaml.load(await fs.readFile(path.join(dataDirectory, 'clubs.yaml'), 'utf8'))
}
