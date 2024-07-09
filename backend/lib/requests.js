const { getRandomDelay, sortByLVAndName, writeToFile } = require("./helpers");

async function makeRequestToBybit(url, method, headers, body) {
  const result = await fetch(url, {
    "headers": {
      ...headers,
      "content-type": "application/json",
      "Referer": "https://www.bybit.com/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: body,
    method: method,
  }).then((res) => res.json())
    .then((data) => data.result)
    .catch(err => console.log(err));
  return result;
}

async function getAllNFTTokens(address) {
  const totalNFTs = await getTotalNFTCount(address);
  console.log(`Total NFTs on address: ${address} - ${totalNFTs}`);
  await getRandomDelay(1500, 2000);

  let [loops, lastSize] = (totalNFTs / 100).toString().split(".");
  loops = Number(loops); lastSize = Number(lastSize);

  let tokens = [];
  for (let i = 0; i < loops + 1; i++) {
    if (i === loops) {
      let checked = await checkNFT(address, lastSize, i);
      tokens = [...tokens, ...(checked.slice(0, lastSize))];
    } else {
      let checked = await checkNFT(address, 100, i);
      tokens = [...tokens, ...checked];
    }
    console.log(`${tokens.length}/${totalNFTs} scanned...`);

    await getRandomDelay(1500, 2000);
  }
  // console.log(tokens);
  return tokens;
}

// ADD COUNT OF HOW MANY TOKENS ARE LISTED
async function countNFTTypes(address) {
  const allTokens = await getAllNFTTokens(address);
  const map = new Map();

  allTokens.forEach(token => {
    const foundToken = map.get(token.name);

    if (foundToken) {
      if (token.listedPrice === null) {
        const unlistedId = foundToken.unlistedId.length > 0 ? [...foundToken.unlistedId, token.id] : [token.id];
        const listedId = foundToken.listedId;
        map.set(token.name, { unlistedId, listedId })
      } else {
        const unlistedId = foundToken.unlistedId;
        const listedId = foundToken.listedId.length > 0 ? [...foundToken.listedId, token.id] : [token.id];
        map.set(token.name, { unlistedId, listedId })
      }

    } else {
      if (token.listedPrice === null) {
        map.set(token.name, { unlistedId: [token.id], listedId: [] })
      } else {
        map.set(token.name, { unlistedId: [], listedId: [token.id] })
      }
    }
  });
  const arr = [];
  map.forEach(({ listedId, unlistedId }, name) => arr.push({ name, unlistedId, listedId }));
  const sortedArr = sortByLVAndName(arr);
  writeToFile('NFT_ids-listed_unListed.json', sortedArr);
  return sortedArr;
}

async function countNFTTypesIds(address) {
  const array = await countNFTTypes(address);
  const newArr = array.map(city => {
    return {
      name: city.name,
      ids: [...city.unlistedId, ...city.listedId]
    }
  });
  writeToFile('NFT_ids.json', newArr);
  return sortByLVAndName(newArr);
}


async function checkNFT(address, size, page) {
  const url = "https://api2.bybit.com/spot/api/nft/dex/v1/personal/center/nftList?page=" + page + "&size=" + size + "&chainCode=&walletAddress=" + address + "&listingStatus=2&contractAddress=0x06224c9387a352a953d6224bfff134c3dd247313";
  const result = await makeRequestToBybit(url, 'GET', null, null);

  const arr = result.map(token => {
    if (token.collectionName === "Mantle City Canvas") {
      return {
        id: token.tokenId,
        name: token.name,
        listedPrice: token.listing?.bybit?.price ? token.listing?.bybit?.price : null
      }
    }
  })
  return arr;
}


async function getTotalNFTCount(address) {
  const url = "https://api2.bybit.com/spot/api/nft/dex/v1/personal/center/info?walletAddress=" + address + "&chainCode=";
  const result = await makeRequestToBybit(url, 'GET', null, null);
  const totalNFTs = result.collectionList.find(c => c.collectionName === "Mantle City Canvas").nftCount
  return totalNFTs;
}

async function getFloor() {
  const url = "https://api2.bybit.com/spot/api/nft/dex/v1/search/nftList?page=0&size=2000&chainCode=mantle&contractAddress=0x06224c9387a352a953d6224bfff134c3dd247313";
  const result = await makeRequestToBybit(url, 'GET', null, null);

  const tempArray = [];

  for (const listing of result) {
    if (tempArray.length === 20) break;
    const foundListing = tempArray.find(
      (currentListing) => currentListing.name === listing.name
    );
    if (!foundListing) {
      tempArray.push({
        name: listing.name,
        price: listing.listing.bybit.price,
      });
    }
  }
  return sortByLVAndName(tempArray);
}

async function getHoldersWith4NFT() {
  let holders = [];
  let hasHoldersWithLessThan4 = false;
  let url = "https://explorer.mantle.xyz/api/v2/tokens/0x06224c9387a352A953d6224bfFF134c3DD247313/holders";
  do {
    const response = await fetch(url, {
      "body": null,
      "method": "GET"
    }).then(resp => resp.json());
    const responseHoldersArray = response.items.flatMap(item => {
      if (item.value < 4) {
        hasHoldersWithLessThan4 = true;
        return [];
      }
      return { address: item.address.hash, count: item.value }
    })
    holders = [...holders, ...responseHoldersArray];
    const { address_hash, items_count, value } = response.next_page_params;
    url = `https://explorer.mantle.xyz/api/v2/tokens/0x06224c9387a352A953d6224bfFF134c3DD247313/holders?address_hash=${address_hash}&items_count=${items_count}&value=${value}`;
    getRandomDelay(600, 1200);
  } while (!hasHoldersWithLessThan4);

  console.log(`Addresses with more or equal to 4 NFTs: ${holders.length}`);
  return holders;
}


module.exports = { getFloor, getTotalNFTCount, getAllNFTTokens, countNFTTypes, countNFTTypesIds, getHoldersWith4NFT }

