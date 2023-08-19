import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {expect} from "chai";
import { TicTacToe } from "../target/types/tic_tac_toe";

describe("tic-tac-toe", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.TicTacToe as Program<TicTacToe>;

    it('setup game!', async() => {
        const gameKeypair = anchor.web3.Keypair.generate();
        
        const playerOne = (program.provider as anchor.AnchorProvider).wallet;
        const playerTwo = anchor.web3.Keypair.generate();
        await program.methods
            .setupGame(playerTwo.publicKey)
            .accounts({
                game: gameKeypair.publicKey,
                playerOne: playerOne.publicKey,
            })
            .signers([gameKeypair])
            .rpc();

        let gameState = await program.account.game.fetch(gameKeypair.publicKey);

        expect(gameState.turn).to.equal(1);
        expect(gameState.players)
            .to
            .eql([playerOne.publicKey, playerTwo.publicKey]);
        expect(gameState.state).to.eql({ active: {} });
        expect(gameState.board)
            .to
            .eql([[null,null,null],[null,null,null],[null,null,null]]);
    });

    it('play game', async() => {
        const gameKeypair = anchor.web3.Keypair.generate();
        const playerOne = (program.provider as anchor.AnchorProvider).wallet;
        const playerTwo = anchor.web3.Keypair.generate();

        await program.methods
            .setupGame(playerTwo.publicKey)
            .accounts({
                game: gameKeypair.publicKey,
                playerOne: playerOne.publicKey,
            })
            .signers([gameKeypair])
            .rpc();
        
        await program.methods.play({ row: 0, column: 1 })
            .accounts({
                game: gameKeypair.publicKey,
            })
            .rpc();

        const gameState = await program.account.game.fetch(gameKeypair.publicKey);

        console.log(gameState);
    });
});
