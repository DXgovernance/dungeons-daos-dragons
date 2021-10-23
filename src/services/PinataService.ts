import RootContext from '../contexts';
import axios from 'axios';
import contentHash from 'content-hash';

export default class PinataService {
  context: RootContext;
  auth: Boolean = false;

  constructor(context: RootContext) {
    this.context = context;
  }

  async isAuthenticated() {
    const pinataApiKey = this.context.configStore.getLocalConfig().pinata;
    try {
      const auth = await axios({
        method: 'GET',
        url: 'https://api.pinata.cloud/data/testAuthentication',
        headers: { Authorization: `Bearer ${pinataApiKey}` },
      });
      this.auth = auth.status === 200;
    } catch (error) {
      this.auth = false;
    }
  }

  async pin(hashToPin: String) {
    console.log('pininng', hashToPin);
    const pinataApiKey = this.context.configStore.getLocalConfig().pinata;
    return axios({
      method: 'POST',
      url: 'https://api.pinata.cloud/pinning/pinByHash',
      data: {
        hashToPin,
        pinataMetadata: {
          name: `DXdao ${this.context.configStore.getActiveChainName()} DescriptionHash ${contentHash.fromIpfs(
            hashToPin
          )}`,
          keyValues: { type: 'proposal' },
        },
      },
      headers: { Authorization: `Bearer ${pinataApiKey}` },
    });
  }

  async getPinList() {
    const pinataApiKey = this.context.configStore.getLocalConfig().pinata;
    return axios({
      method: 'GET',
      url: `https://api.pinata.cloud/data/pinList?pageLimit=1000&metadata[name]=DXdao ${this.context.configStore.getActiveChainName()}`,
      headers: { Authorization: `Bearer ${pinataApiKey}` },
    });
  }
}
