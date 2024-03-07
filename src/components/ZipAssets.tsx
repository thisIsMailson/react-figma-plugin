import React from "react";
import JSZip from "../../node_modules/jszip/dist/jszip.min.js";

function typedArrayToBuffer(array) {
  return array.buffer.slice(
    array.byteOffset,
    array.byteLength + array.byteOffset
  );
}

function exportTypeToBlobType(type: string) {
  switch (type) {
    case "PDF":
      return "application/pdf";
    case "SVG":
      return "image/svg+xml";
    case "PNG":
      return "image/png";
    case "JPG":
      return "image/jpeg";
    default:
      return "image/png";
  }
}

function exportTypeToFileExtension(type: string) {
  switch (type) {
    case "PDF":
      return ".pdf";
    case "SVG":
      return ".svg";
    case "PNG":
      return ".png";
    case "JPG":
      return ".jpg";
    default:
      return ".png";
  }
}
type ExportableNode = {
  data: {
    name: string;
    setting: {
      format: string;
      suffix: string;
      constraint: {
        type: string;
        value: number;
      };
      contentsOnly: boolean;
    };
    bytes: ArrayBuffer;
  };
};

export const ZipAssets = ({ data }) => {
  data &&
    new Promise((resolve) => {
      let zip = new JSZip();

      for (data of data) {
        const { bytes, name, setting } = data;
        const cleanBytes = typedArrayToBuffer(bytes);
        const type = exportTypeToBlobType(setting.format);
        const extension = exportTypeToFileExtension(setting.format);
        let blob = new Blob([cleanBytes], { type });
        zip.file(`${name}${setting.suffix}${extension}`, blob, {
          base64: true,
        });
      }

      zip.generateAsync({ type: "blob" }).then((content: Blob) => {
        const blobURL = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.className = "button button--primary";
        link.href = blobURL;
        link.download = "export.zip";
        link.click();
        link.setAttribute("download", name + ".zip");
        // @ts-ignore
        resolve();
      });
    }).then(() => {
      window.parent.postMessage({ pluginMessage: "Done!" }, "*");
    });
  return <>{`Zipping your files :)`}</>;
};
