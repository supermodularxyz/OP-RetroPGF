import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { type SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";

import { type ListAttestation } from "~/hooks/useCreateList";

const EASContractAddress = process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS!;
const schemaUID = process.env.NEXT_PUBLIC_LISTS_SCHEMA!;

export async function createAttestation(
  { owner, ...list }: ListAttestation,
  signer: SignerOrProvider
) {
  console.log("Creating EAS instance...");
  const eas = new EAS(EASContractAddress);

  console.log("Connecting signer to EAS...");
  eas.connect(signer);

  console.log("Encoding data with schema...");
  const data = encodeData(list);

  console.log("Creating attestation...");
  const tx = await eas.attest({
    schema: schemaUID,
    data: { recipient: owner, expirationTime: 0n, revocable: true, data },
  });
  console.log("Transaction: ", tx);

  return await tx.wait();
}

function encodeData({
  listName,
  listMetadataPtrType,
  listMetadataPtr,
}: Omit<ListAttestation, "owner">) {
  const schemaEncoder = new SchemaEncoder(
    "string listName, uint256 listMetadataPtrType, string listMetadataPtr"
  );
  return schemaEncoder.encodeData([
    { name: "listName", value: listName, type: "string" },
    {
      name: "listMetadataPtrType",
      value: listMetadataPtrType,
      type: "uint256",
    },
    { name: "listMetadataPtr", value: listMetadataPtr, type: "string" },
  ]);
}
