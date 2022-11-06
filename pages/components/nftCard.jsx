import React, { useState } from "react";
import { CopyButtonIcon } from "./CopyButtonIcon";

export const NFTCard = ({ nft }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(nft.contract.address)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function copyTextToClipboard() {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(nft.contract.address);
    } else {
      return document.execCommand("copy", true, err);
    }
  }

  return (
    <div className="w-1/4 flex flex-col ">
      <div className="rounded-md">
        <img
          className="object-cover h-128 w-full rounded-t-md"
          src={nft.media[0].gateway}
        ></img>
      </div>
      <div className="flex flex-col y-gap-2  px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
        <div className="">
          <h2 className="text-xl text-gray-800">{nft.title}</h2>
          <p className="text-gray-600">
            Id: {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}
          </p>
          <p className="text-gray-600">{`${nft.contract.address.substr(
            0,
            4
          )}...${nft.contract.address.substr(
            nft.contract.address.length - 4
          )}`}</p>
          <button onClick={handleCopyClick}>
            <span>
              {isCopied ? "Copied!" : ""}
              <CopyButtonIcon />
            </span>
          </button>
        </div>

        <div className="flex-grow mt-2">
          <p className="text-gray-600">{nft.description?.substr(0, 150)}</p>
        </div>
        <div className="flex justify-center mb-1">
          <a
            target={"_blank"}
            href={`https://etherscan.io/token/${nft.contract.address}`}
            className="flex flex-col y-gap-2 px-2 py-3 bg-blue-300 text-center rounded-b-md  bg-sky-500 hover:bg-sky-700 rounded-b-m h-100 text-white cursor-pointer"
          >
            View on etherscan
          </a>
        </div>
      </div>
    </div>
  );
};
