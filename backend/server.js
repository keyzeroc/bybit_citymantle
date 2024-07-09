const express = require('express');
const { getFloor, getTotalNFTCount, getAllNFTTokens, countNFTTypes, countNFTTypesIds, getHoldersWith4NFT } = require('./lib/requests');
const app = express();

const routes = {
  count: countNFTTypes,
  count2: countNFTTypesIds,
  total: getTotalNFTCount,
  tokens: getAllNFTTokens,
  floor: getFloor,
  holders: getHoldersWith4NFT
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/:route', async (req, res) => {
  try {
    const route = req.params?.route;
    let availableRoutesArr = Object.keys(routes)
    if (!availableRoutesArr.includes(route)) {
      return res.status(404).send('Route not found, available routes: ' + availableRoutesArr + "; example - /api/" + availableRoutesArr[0]);
    }
    const address = req.query?.address;
    if (route !== 'floor' && route !== 'holders' && !address) {
      return res.status(400).send('To get wallet info, please provide a wallet address');
    }

    const result = await routes[req?.params?.route](address);
    if (result === null) {
      return res.status(500).send('Error retrieving data!');
    }
    res.status(200).send(JSON.stringify(result));
  }
  catch (err) {
    res.status(500).send('Error message: ' + err.message)
  }
});


app.listen(3000, () => {
  console.log('server listening on port 3000')
})