import * as messages from './messages';

const { selection } = figma.currentPage;
console.log('selection', selection);
async function main() {
  figma.showUI(__html__, { width: 320, height: 250 });

  const allFrameNodes = await getNodes(selection);

  figma.ui.postMessage({
    type: messages.FRAME_ASSETS_ZIP,
    payload: allFrameNodes,
  });

  figma.ui.onmessage = (msg) => {
    console.log('msg', msg);
  };
}

function hasValidSelection(nodes) {
  return !(!nodes || nodes.length === 0);
}
const getNodes = async (nodes) => {
  if (!hasValidSelection(nodes))
    return Promise.resolve('Nothing selected for export');

  let exportableBytes = [];

  for (let parentNode of nodes) {
    // Use Promise.all() to parallelize export operations for each child node
    await Promise.all(
      parentNode.children.map(async (node) => {
        let { name: parentNodeName } = parentNode; // This will be used to name the folders accordingly
        let { name, exportSettings: nodeExportSettings } = node;
        console.log('node sett', name);

        if (nodeExportSettings.length === 0) {
          nodeExportSettings = [
            {
              format: 'PNG',
              suffix: '',
              constraint: { type: 'SCALE', value: 1 },
              contentsOnly: true,
            },
          ];
        }

        nodeExportSettings.forEach((setting) => {
          // Remove leading space and prefix
          const cleanedName = name.trim().replace(/^@\d+\s*/, '');

          // Check if "name" starts with "@1" or "@2"
          if (name.startsWith('@1')) {
            setting.constraint.value = 0.5;
          } else if (name.startsWith('@2')) {
            setting.constraint.value = 1;
          }
        });

        await Promise.all(
          nodeExportSettings.map(async (setting) => {
            let defaultSetting = setting;
            const bytes = await node.exportAsync(defaultSetting);
            exportableBytes.push({
              parentNodeName,
              name,
              setting,
              bytes,
            });
          })
        );
      })
    );
  }
  console.log('exportable nodes =>', exportableBytes);

  return exportableBytes;
};
main();
