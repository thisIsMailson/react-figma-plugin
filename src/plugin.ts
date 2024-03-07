import * as messages from "./messages";

const { selection } = figma.currentPage;

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
  if (!hasValidSelection(selection))
    return Promise.resolve("Nothing selected for export");

  let exportableBytes = [];
  for (let node of nodes[0].children) {
    let { name, exportSettings } = node;
    if (exportSettings.length === 0) {
      exportSettings = [
        {
          format: "PNG",
          suffix: "",
          constraint: { type: "SCALE", value: 1 },
          contentsOnly: true,
        },
      ];
    }

    for (let setting of exportSettings) {
      let defaultSetting = setting;
      const bytes = await node.exportAsync(defaultSetting);
      exportableBytes.push({
        name,
        setting,
        bytes,
      });
    }
  }

  return exportableBytes;
};
main();
