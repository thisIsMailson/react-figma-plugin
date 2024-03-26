import * as messages from "./messages";

const { selection } = figma.currentPage;
console.log("selection", selection);
async function main() {
  figma.showUI(__html__, { width: 320, height: 250 });

  const allFrameNodes = await getNodes(selection);

  figma.ui.postMessage({
    type: messages.FRAME_ASSETS_ZIP,
    payload: allFrameNodes,
  });

  figma.ui.onmessage = (msg) => {
    console.log("msg", msg);
  };
}

function hasValidSelection(nodes) {
  return !(!nodes || nodes.length === 0);
}
const getNodes = async (nodes) => {
  if (!hasValidSelection(nodes))
    return Promise.resolve("Nothing selected for export");

  let exportableBytes = [];

  for (let parentNode of nodes) {
    // Use Promise.all() to parallelize export operations for each child node
    await Promise.all(
      parentNode.children.map(async (node) => {
        let { name: parentNodeName, exportSettings } = parentNode; // Extract parent node's name
        let { name, exportSettings: nodeExportSettings } = node; // Extract child node's name and export settings

        if (nodeExportSettings.length === 0) {
          nodeExportSettings = [
            {
              format: "PNG",
              suffix: "",
              constraint: { type: "SCALE", value: 1 },
              contentsOnly: true,
            },
          ];
        }

        await Promise.all(
          nodeExportSettings.map(async (setting) => {
            let defaultSetting = setting;
            const bytes = await node.exportAsync(defaultSetting);
            exportableBytes.push({
              parentNodeName, // Include parent node's name
              name, // Include child node's name
              setting,
              bytes,
            });
          })
        );
      })
    );
  }
  console.log("exportable nodes =>", exportableBytes);

  return exportableBytes;
};
main();
 