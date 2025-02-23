import React, {Component} from 'react'
import {Button, StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import SearchGameButton from './SearchGameButton.js'

class GameTable extends Component {
    constructor(props) {
        super(props)

        this.subscriber = props.subscriber
        this.moveHandler = props.moveHandler
        this.searchHandler = props.searchHandler
        this.quiteHandler = props.quiteHandler
        this.rows = [0, 1, 2]

        this.state = {
            map: new Map(),
            isFirstTurn: props.isFirstTurn,
            isMyTurn: props.isFirstTurn,
            isGameActive: true,
            opponent: props.opponent,
            prevGameResult: null,
        }
    }

    getCellStyle = (index) => {
        return this.state.map.get(index) ? styles.cross : styles.zero
    }

    getCellContent = (index) => {
        return this.state.map.has(index)
            ? (this.state.map.get(index) ? 'X' : 'O')
            : ''
    }

    componentDidMount() {
        this.subscriber
            .on('gameStarted', (data) => this.gameStart(data.opponent, data.isYourTurn))
            .on('opponentMoved', (data) => this.updateOpponentMove(data.position))
            .on('gameFinished', (data) => this.finishGame(data.status))
    }

    gameStart = (opponent, isFirstTurn) => {
        this.setState({
            map: new Map(),
            isFirstTurn,
            isMyTurn: isFirstTurn,
            isGameActive: true,
            opponent,
        })
    }

    finishGame = (result) => {
        this.setState({
            isMyTurn: false,
            isGameActive: false,
            prevGameResult: result,
        })
    }

    passBoardMove = (position, isCurrentPlayer = true) => {
        this.setState((prevState) => {
            const newMap = new Map(prevState.map)
            const playerIndex = Number(isCurrentPlayer ? prevState.isFirstTurn : !prevState.isFirstTurn)
            newMap.set(position, playerIndex)

            return {
                map: newMap,
                isMyTurn: !prevState.isMyTurn,
            }
        })
    }

    updateTurn = (position) => {
        if (this.state.isMyTurn && this.state.isGameActive && !this.state.map.has(position)) {
            this.moveHandler(position)
            this.passBoardMove(position)
        }
    }

    updateOpponentMove = (position) => this.passBoardMove(position, false)

    getStatus = () => {
        return this.state.isGameActive
            ? this.state.isMyTurn ? 'Your turn' : ''
            : <Text style={styles.resultText}>{this.state.prevGameResult}</Text>
    }

    getOpponent = () => this.state.opponent || 'Dude'

    render() {
        const bottomButton = this.state.isGameActive
            ? <Button onPress={this.quiteHandler} color="steelblue" title="Quit"/>
            : <SearchGameButton style={styles.searchButton} handler={this.searchHandler}/>

        return (
            <View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{'vs '}{this.getOpponent()}</Text>
                    <Text style={[styles.headerText, styles.colored]}>{this.getStatus()}</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.table}>
                        {this.rows.map((col) => (
                            <View key={'col' + col} style={styles.col}>
                                {this.rows.map((row) => (
                                    <TouchableHighlight
                                        key={'row' + row}
                                        style={styles.row}
                                        onPress={() => this.updateTurn(col * 3 + row)}
                                        underlayColor="whitesmoke">
                                        <Text style={this.getCellStyle(col * this.rows.length + row)}>
                                            {this.getCellContent(col * this.rows.length + row)}
                                        </Text>
                                    </TouchableHighlight>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.footer}>{bottomButton}</View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        marginVertical: 20,
        marginHorizontal: 20,
        height: 240
    },
    header: {
        flex: 1,
        flexDirection: 'row',
    },
    headerText: {
        textAlign: 'center',
        color: 'lightgray',
        fontWeight: 'bold',
        fontSize: 20,
        height: 40,
        width: '50%'
    },
    resultText: {
        color: 'chocolate',
        textTransform: 'uppercase',
    },
    footer: {
        height: 60
    },
    table: {
        flex: 1,
        marginVertical: 20,
        overflow: 'hidden'
    },
    col: {
        flex: 1,
        flexDirection: 'row',
    },
    row: {
        flex: 1,
        margin: 0,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: '#DFDFDF'
    },
    cross: {
        fontSize: 20,
        color: 'steelblue',
        fontWeight: 'bold',
    },
    zero: {
        fontSize: 20,
        color: 'chocolate',
        fontWeight: 'bold',
    },
    searchButton: {
        paddingTop: 20
    },
    colored: {
        color: 'steelblue',
    }
})

export default GameTable