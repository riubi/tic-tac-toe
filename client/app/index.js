import React, {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import NickNameInput from '../components/NickNameInput.js'
import SearchGameButton from '../components/SearchGameButton.js'
import GameTable from '../components/GameTable.js'
import MadeBy from '../components/MadeBy.js'
import GameApi from '../services/GameApi.js'
import Config from '../config.js'

export class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            interfaceName: 'loading',
            isFirstTurn: false,
            opponent: null,
        }

        this.gameApi = new GameApi(Config.SERVER_URL)
    }

    openInterface = (interfaceName) => {
        this.setState({interfaceName})
    }

    componentDidMount() {
        this.gameApi.getSubscriber()
            .on('open', () => this.openInterface('lobby'))
            .on('error', () => this.openInterface('error'))
            .on('gameStarted', (data) => {
                if (this.state.interfaceName !== 'game') {
                    this.setState({
                        interfaceName: 'game',
                        isFirstTurn: data.isYourTurn,
                        opponent: data.opponent,
                    })
                }
            })
    }

    renderInterface() {
        switch (this.state.interfaceName) {
            case 'game':
                return (
                    <GameTable
                        subscriber={this.gameApi.getSubscriber()}
                        searchHandler={this.gameApi.searchGameFn()}
                        moveHandler={this.gameApi.makeMoveFn()}
                        quiteHandler={this.gameApi.quitFn()}
                        isFirstTurn={this.state.isFirstTurn}
                        opponent={this.state.opponent}
                    />
                )
            case 'lobby':
                return (
                    <View>
                        <NickNameInput handler={this.gameApi.setNameFn()}/>
                        <SearchGameButton handler={this.gameApi.searchGameFn()}/>
                        <MadeBy/>
                    </View>
                )
            case 'error':
                return <Text style={styles.title}>Something went wrong 😔</Text>
            default:
                return <Text style={styles.title}>Loading...</Text>
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.block}>
                    <Text style={styles.title}>Tic-Tac-Toe</Text>
                    {this.renderInterface()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    block: {
        maxWidth: 244,
        width: '100%',
    },
    title: {
        fontSize: 28,
        paddingBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'lightgray',
        marginVertical: 20,
        marginHorizontal: 20,
    },
})

export default App