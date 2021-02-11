import React from 'react';
import { ethers } from 'ethers';
import {
    CONTRACTS,
    READ_WEB3_PROVIDER,
    CACHE_WALLET_KEY,
    NETWORK_CHAIN_ID,
    AMPL
} from 'config';
import cache from 'utils/cache';
import TOKEN_ABI from 'abis/token.json';
import CONTROLLER_ABI from 'abis/controller.json';
import ORACLE_ABI from 'abis/oracle.json';

export const READ_PROVIDER = new ethers.providers.JsonRpcProvider(
    READ_WEB3_PROVIDER
);

const WalletContext = React.createContext(null);

export function WalletProvider({ children }) {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isConnecting, setIsConnecting] = React.useState(false);
    const [chainId, setChainId] = React.useState(null);
    const [signer, setSigner] = React.useState(null);
    const [address, setAddress] = React.useState(null);
    const [availableT]

    const isOnWrongNetwork = React.useMemo(
        () => chainId && chainId !== NETWORK_CHAIN_ID,
        [chainId]
    );

    React.useEffect(() => {
        (async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            console.log(signer)
            setSigner(signer)
            const address = await signer.getAddress();
            console.log(address)
            setAddress(address);
            let { chainId: c } = await provider.getNetwork();
            setChainId(c);
        })();
    }, [chainId]);


    const tokenContract = React.useMemo(
        () =>
            new ethers.Contract(AMPL.token, TOKEN_ABI, signer || READ_PROVIDER),
        [signer]
    );

    // const controllerContract = React.useMemo(
    //   () =>
    //     new ethers.Contract(
    //       CONTRACTS.controller,
    //       CONTROLLER_ABI,
    //       signer || READ_PROVIDER
    //     ),
    //   [signer]
    // );

    // const oracleContract = React.useMemo(
    //   () =>
    //     new ethers.Contract(
    //       CONTRACTS.oracle,
    //       ORACLE_ABI,
    //       signer || READ_PROVIDER
    //     ),
    //   [signer]
    // );

    const startConnecting = () => setIsConnecting(true);
    const stopConnecting = () => setIsConnecting(false);

    const setProvider = React.useCallback(async function (web3Provider) {
        web3Provider.on('accountsChanged', () => {
            window.location.reload();
        });
        web3Provider.on('chainChanged', () => {
            window.location.reload();
        });
        // web3Provider.on('disconnect', () => {
        //   disconnect();
        // });
        const provider = new ethers.providers.Web3Provider(web3Provider);
        let { chainId: c } = await provider.getNetwork();
        // android trust wallet bug
        [56, 97].forEach(o => {
            if (parseInt(`0x${o}`, 16) === parseInt(c)) c = o;
        });
        setChainId(c);
        if (c === NETWORK_CHAIN_ID) {
            const signer = provider.getSigner();
            setSigner(signer);
            setAddress(await signer.getAddress());
            stopConnecting();
        }
    }, []);

    const disconnect = async function () {
        cache(CACHE_WALLET_KEY, null);
        setSigner(null);
        setAddress(null);
        setChainId(null);
    };

    const connectMetamask = React.useCallback(
        async function () {
            await window.ethereum.enable();
            cache(CACHE_WALLET_KEY, 'metamask');
            await setProvider(window.ethereum);
        },
        [setProvider]
    );

    const connectBsc = React.useCallback(
        async function () {
            if (!window.BinanceChain) return;
            await window.BinanceChain.enable();
            cache(CACHE_WALLET_KEY, 'bsc');
            await setProvider(window.BinanceChain);
        },
        [setProvider]
    );

    const connectTrust = React.useCallback(
        async function () {
            await window.ethereum.enable();
            if (!window.ethereum.isTrust) return;
            cache(CACHE_WALLET_KEY, 'trust');
            await setProvider(window.ethereum);
        },
        [setProvider]
    );

    const connectToCached = React.useCallback(
        async function () {
            if (address) return;

            const cachedWallet = cache(CACHE_WALLET_KEY);
            if (cachedWallet) {
                const c = {
                    metamask: connectMetamask,
                    bsc: connectBsc,
                    trust: connectTrust,
                };
                c[cachedWallet]();
            }
        },
        [address, connectMetamask, connectBsc, connectTrust]
    );

    React.useEffect(() => {
        (async () => {
            await connectToCached();
            setIsLoaded(true);
        })();
    }, [connectToCached]);

    return (
        <WalletContext.Provider
            value={{
                isLoaded,

                chainId,
                signer,
                address,
                isConnecting,
                startConnecting,
                stopConnecting,
                disconnect,
                connectMetamask,
                connectBsc,
                connectTrust,

                isOnWrongNetwork,
                tokenContract,
                // controllerContract,
                // oracleContract,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = React.useContext(WalletContext);
    if (!context) {
        throw new Error('Missing wallet context');
    }
    const {
        isLoaded,

        chainId,
        signer,
        address,
        isConnecting,
        startConnecting,
        stopConnecting,
        disconnect,
        connectMetamask,
        connectBsc,
        connectTrust,

        isOnWrongNetwork,
        tokenContract,
        // controllerContract,
        // oracleContract,
    } = context;

    return {
        isLoaded,

        chainId,
        signer,
        address,
        isConnecting,
        startConnecting,
        stopConnecting,
        disconnect,
        connectMetamask,
        connectBsc,
        connectTrust,

        isOnWrongNetwork,
        tokenContract,
        // controllerContract,
        // oracleContract,
    };
}
