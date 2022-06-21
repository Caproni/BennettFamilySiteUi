import * as Forge from 'node-forge';

export function encryptRsa(publicKey: string, input: string): string {
    const rsa = Forge.pki.publicKeyFromPem(publicKey);
    return Forge.util.encode64(
        rsa.encrypt(
            Forge.util.encodeUtf8(input),
            'RSAES-PKCS1-V1_5',
            {
                md: Forge.md.sha1.create(),
                mgf1: {
                    md: Forge.md.sha1.create()
                }
            }
        ));
}
