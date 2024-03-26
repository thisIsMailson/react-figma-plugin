import { UPDATE_PLUGIN_DATA } from "./messages";
const DATA_KEY = "FIGMA_NEWS_APP";

const DATA_STRUCTURE = {
  local: {},
  document: {},
};
const NODE_DATA = {
  data: [],
};

export class PluginDataManager {
  data: object;
  figma: PluginAPI;

  constructor(figma: PluginAPI) {
    this.data = NODE_DATA;
    this.figma = figma;

  }

  setNodeData(nodeData) {
    this.data["data"] = nodeData;
  }

}
