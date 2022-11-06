import Head from "next/head";
import { useState, useEffect } from "react";
import { NFTCard } from "./components/nftCard";

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [pages, setPages] = useState(0);
  const [loadPage, setLoadPage] = useState(1);
  const [newNFTs, setNewNFTs] = useState([]);

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API;
    const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${api_key}/getNFTs/`;

    if (!collection.length) {
      var requestOptions = {
        method: "GET",
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("fetching nfts for colletion owned by addresss");

      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
    }

    if (nfts) {
      console.log("nfts", nfts);
      setNFTs(nfts.ownedNfts);
      setPages(0);
      setLoadPage(1);
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const api_key = process.env.NEXT_PUBLIC_ALCHEMY_API;
      const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );

      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
        setPages(0);
        setLoadPage(1);
      }
    }
  };

  const loadMoreNfts = (page) => {
    let start = (page - 1) * 10;
    let end = start + 9;
    let newNFTs = NFTs.slice(start, end);
    console.log("New NFTs : ", newNFTs);
    setNewNFTs(newNFTs);
    setPages(Math.ceil(NFTs.length / 10));
  };

  useEffect(() => {
    loadMoreNfts(loadPage);
    window.scrollTo(0, 0);
  }, [NFTs, loadPage]);

  return (
    <div className="flex flex-col bg-[url('https://wallpaperaccess.com/full/5927911.gif')] bg-fixed items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <Head>
          <title>orlees-NFT-Gallery</title>
        </Head>

        <input
          disabled={fetchForCollection}
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50 "
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add your wallet address"
        ></input>
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50 "
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>
        <label className="text-gray-600 ">
          <input
            type="checkbox"
            className="mr-2"
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
          />{" "}
          Fetch for collection
        </label>
        <button
          className={
            "disabled:bg-slate-500 text-white  bg-sky-500 hover:bg-sky-700 px-4 py-2 mt-3 rounded-sm w-1/5"
          }
          onClick={() => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else fetchNFTs();
          }}
        >
          Let's go!{" "}
        </button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {newNFTs.length &&
          newNFTs.map((nfts) => <NFTCard key={nfts.id?.tokenId} nft={nfts} />)}
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {pages > 0 &&
          [...Array(pages)].map((data, index) =>
            index + 1 == loadPage ? (
              <button
                className={
                  "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm max-w-max"
                }
                key={index}
                onClick={() => {
                  setLoadPage(index + 1);
                }}
              >
                {index + 1}
              </button>
            ) : (
              <button
                className={
                  "disabled:bg-slate-500 text-white max-w-max bg-blue-400 px-2 py-2 mt-3 rounded-sm"
                }
                key={index}
                onClick={() => {
                  setLoadPage(index + 1);
                }}
              >
                {index + 1}
              </button>
            )
          )}
      </div>
      <div>
        <div
          className="bg"
          color="black
       "
        ></div>
      </div>
    </div>
  );
};

export default Home;
