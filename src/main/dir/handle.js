/*
 * This package used to get project root path
 *
 * Method:Init project root path
 * params:no
 * return:project path
 */
function getProjectPath() {
  return process.cwd()
}

exports.handlePath = getProjectPath
