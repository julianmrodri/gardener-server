import EthCrypto from 'eth-crypto';

import InvalidEncryptionError from '@core/domain/common/utils/error/InvalidEncryptionError';

class DecryptUrlUseCase {
  private typeRegex = new RegExp(/(encrypted\(.*?\))/g);

  constructor(private readonly privateKey: string) {
  }

  async decrypt(url: string): Promise<string> {
    if (!this.typeRegex.test(url)) {
        return url;
    }

    for (const group of url.match(this.typeRegex)) {
        const encrypted = group.substr(group.indexOf('(') + 1, group.length - 'encrypted()'.length);

        let decrypted: string;
        try {
            decrypted = await EthCrypto.decryptWithPrivateKey(
                this.privateKey,
                EthCrypto.cipher.parse(encrypted),
            );
        } catch (e) {
            throw new InvalidEncryptionError('Invalid encryption data. Expected a stringified object ' +
                '{iv, ephemPublicKey, ciphertext, mac} encrypted with gardener public key')
            ;
        }
        url = url.replace(group, decrypted);
    }

    return url;
  }
}

export default DecryptUrlUseCase;
