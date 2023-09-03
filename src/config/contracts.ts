export const contracts = {
  Registry: {
    address: "0xAEc621EC8D9dE4B524f4864791171045d6BBBe27",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "AMOUNT_MISMATCH",
        type: "error",
      },
      {
        inputs: [],
        name: "NONCE_NOT_AVAILABLE",
        type: "error",
      },
      {
        inputs: [],
        name: "NOT_PENDING_OWNER",
        type: "error",
      },
      {
        inputs: [],
        name: "UNAUTHORIZED",
        type: "error",
      },
      {
        inputs: [],
        name: "ZERO_ADDRESS",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            indexed: false,
            internalType: "struct Metadata",
            name: "metadata",
            type: "tuple",
          },
          {
            indexed: false,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "anchor",
            type: "address",
          },
        ],
        name: "ProfileCreated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            indexed: false,
            internalType: "struct Metadata",
            name: "metadata",
            type: "tuple",
          },
        ],
        name: "ProfileMetadataUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: false,
            internalType: "address",
            name: "anchor",
            type: "address",
          },
        ],
        name: "ProfileNameUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ProfileOwnerUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "ProfilePendingOwnerUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "previousAdminRole",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "newAdminRole",
            type: "bytes32",
          },
        ],
        name: "RoleAdminChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleGranted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleRevoked",
        type: "event",
      },
      {
        inputs: [],
        name: "ALLO_OWNER",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "NATIVE",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
        ],
        name: "acceptProfileOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address[]",
            name: "_members",
            type: "address[]",
          },
        ],
        name: "addMembers",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "anchorToProfileId",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_nonce",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            internalType: "struct Metadata",
            name: "_metadata",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "_members",
            type: "address[]",
          },
        ],
        name: "createProfile",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_anchor",
            type: "address",
          },
        ],
        name: "getProfileByAnchor",
        outputs: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "protocol",
                    type: "uint256",
                  },
                  {
                    internalType: "string",
                    name: "pointer",
                    type: "string",
                  },
                ],
                internalType: "struct Metadata",
                name: "metadata",
                type: "tuple",
              },
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "anchor",
                type: "address",
              },
            ],
            internalType: "struct IRegistry.Profile",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
        ],
        name: "getProfileById",
        outputs: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "id",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "protocol",
                    type: "uint256",
                  },
                  {
                    internalType: "string",
                    name: "pointer",
                    type: "string",
                  },
                ],
                internalType: "struct Metadata",
                name: "metadata",
                type: "tuple",
              },
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "anchor",
                type: "address",
              },
            ],
            internalType: "struct IRegistry.Profile",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
        ],
        name: "getRoleAdmin",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRole",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_member",
            type: "address",
          },
        ],
        name: "isMemberOfProfile",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
        ],
        name: "isOwnerOfProfile",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_account",
            type: "address",
          },
        ],
        name: "isOwnerOrMemberOfProfile",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        name: "profileIdToPendingOwner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        name: "profilesById",
        outputs: [
          {
            internalType: "bytes32",
            name: "id",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            internalType: "struct Metadata",
            name: "metadata",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "anchor",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_token",
            type: "address",
          },
          {
            internalType: "address",
            name: "_recipient",
            type: "address",
          },
        ],
        name: "recoverFunds",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address[]",
            name: "_members",
            type: "address[]",
          },
        ],
        name: "removeMembers",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            internalType: "struct Metadata",
            name: "_metadata",
            type: "tuple",
          },
        ],
        name: "updateProfileMetadata",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
        ],
        name: "updateProfileName",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_pendingOwner",
            type: "address",
          },
        ],
        name: "updateProfilePendingOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
  Allo: {
    address: "0x79536CC062EE8FAFA7A19a5fa07783BD7F792206",
    abi: [
      {
        inputs: [],
        name: "AMOUNT_MISMATCH",
        type: "error",
      },
      {
        inputs: [],
        name: "INVALID_FEE",
        type: "error",
      },
      {
        inputs: [],
        name: "IS_APPROVED_STRATEGY",
        type: "error",
      },
      {
        inputs: [],
        name: "MISMATCH",
        type: "error",
      },
      {
        inputs: [],
        name: "NOT_APPROVED_STRATEGY",
        type: "error",
      },
      {
        inputs: [],
        name: "NOT_CONTRACT",
        type: "error",
      },
      {
        inputs: [],
        name: "NOT_ENOUGH_FUNDS",
        type: "error",
      },
      {
        inputs: [],
        name: "NewOwnerIsZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "NoHandoverRequest",
        type: "error",
      },
      {
        inputs: [],
        name: "UNAUTHORIZED",
        type: "error",
      },
      {
        inputs: [],
        name: "Unauthorized",
        type: "error",
      },
      {
        inputs: [],
        name: "ZERO_ADDRESS",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "poolId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "BaseFeePaid",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "baseFee",
            type: "uint256",
          },
        ],
        name: "BaseFeeUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "feePercentage",
            type: "uint256",
          },
        ],
        name: "FeePercentageUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint8",
            name: "version",
            type: "uint8",
          },
        ],
        name: "Initialized",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "oldOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "poolId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "profileId",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "contract IStrategy",
            name: "strategy",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            indexed: false,
            internalType: "struct Metadata",
            name: "metadata",
            type: "tuple",
          },
        ],
        name: "PoolCreated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "poolId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
        ],
        name: "PoolFunded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "poolId",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            indexed: false,
            internalType: "struct Metadata",
            name: "metadata",
            type: "tuple",
          },
        ],
        name: "PoolMetadataUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "registry",
            type: "address",
          },
        ],
        name: "RegistryUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "previousAdminRole",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "newAdminRole",
            type: "bytes32",
          },
        ],
        name: "RoleAdminChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleGranted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleRevoked",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "strategy",
            type: "address",
          },
        ],
        name: "StrategyApproved",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "strategy",
            type: "address",
          },
        ],
        name: "StrategyRemoved",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "treasury",
            type: "address",
          },
        ],
        name: "TreasuryUpdated",
        type: "event",
      },
      {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "FEE_DENOMINATOR",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "NATIVE",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_manager",
            type: "address",
          },
        ],
        name: "addPoolManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_strategy",
            type: "address",
          },
        ],
        name: "addToCloneableStrategies",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "allocate",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256[]",
            name: "_poolIds",
            type: "uint256[]",
          },
          {
            internalType: "bytes[]",
            name: "_datas",
            type: "bytes[]",
          },
        ],
        name: "batchAllocate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256[]",
            name: "_poolIds",
            type: "uint256[]",
          },
          {
            internalType: "bytes[]",
            name: "_data",
            type: "bytes[]",
          },
        ],
        name: "batchRegisterRecipient",
        outputs: [
          {
            internalType: "address[]",
            name: "",
            type: "address[]",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_strategy",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "_initStrategyData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "_token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            internalType: "struct Metadata",
            name: "_metadata",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "_managers",
            type: "address[]",
          },
        ],
        name: "createPool",
        outputs: [
          {
            internalType: "uint256",
            name: "poolId",
            type: "uint256",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "_profileId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "_strategy",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "_initStrategyData",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "_token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            internalType: "struct Metadata",
            name: "_metadata",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "_managers",
            type: "address[]",
          },
        ],
        name: "createPoolWithCustomStrategy",
        outputs: [
          {
            internalType: "uint256",
            name: "poolId",
            type: "uint256",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "_recipientIds",
            type: "address[]",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "distribute",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "fundPool",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "getBaseFee",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getFeePercentage",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
        ],
        name: "getPool",
        outputs: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "profileId",
                type: "bytes32",
              },
              {
                internalType: "contract IStrategy",
                name: "strategy",
                type: "address",
              },
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "protocol",
                    type: "uint256",
                  },
                  {
                    internalType: "string",
                    name: "pointer",
                    type: "string",
                  },
                ],
                internalType: "struct Metadata",
                name: "metadata",
                type: "tuple",
              },
              {
                internalType: "bytes32",
                name: "managerRole",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "adminRole",
                type: "bytes32",
              },
            ],
            internalType: "struct IAllo.Pool",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getRegistry",
        outputs: [
          {
            internalType: "contract IRegistry",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
        ],
        name: "getRoleAdmin",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
        ],
        name: "getStrategy",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getTreasury",
        outputs: [
          {
            internalType: "address payable",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRole",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_registry",
            type: "address",
          },
          {
            internalType: "address payable",
            name: "_treasury",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_feePercentage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_baseFee",
            type: "uint256",
          },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_strategy",
            type: "address",
          },
        ],
        name: "isCloneableStrategy",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_address",
            type: "address",
          },
        ],
        name: "isPoolAdmin",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_address",
            type: "address",
          },
        ],
        name: "isPoolManager",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "result",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [
          {
            internalType: "uint256",
            name: "result",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_token",
            type: "address",
          },
          {
            internalType: "address",
            name: "_recipient",
            type: "address",
          },
        ],
        name: "recoverFunds",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "registerRecipient",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_strategy",
            type: "address",
          },
        ],
        name: "removeFromCloneableStrategies",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_manager",
            type: "address",
          },
        ],
        name: "removePoolManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_baseFee",
            type: "uint256",
          },
        ],
        name: "updateBaseFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_feePercentage",
            type: "uint256",
          },
        ],
        name: "updateFeePercentage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_poolId",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "protocol",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "pointer",
                type: "string",
              },
            ],
            internalType: "struct Metadata",
            name: "_metadata",
            type: "tuple",
          },
        ],
        name: "updatePoolMetadata",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_registry",
            type: "address",
          },
        ],
        name: "updateRegistry",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address payable",
            name: "_treasury",
            type: "address",
          },
        ],
        name: "updateTreasury",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
  DirectGrantsSimple: {
    address: "0xf243619f931c81617EE00bAAA5c5d97aCcC5af10",
    abi: [],
  },
} as const;
