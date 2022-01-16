import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import NickNameInput from './src/component/nick-name-input.js'
import SearchGameButton from './src/component/search-game-button.js'
import GameTable from './src/component/game-table.js'
import GameApi from './src/sdk/game-api.js'

export class App extends React.Component {
  constructor() {
    super()

    this.state = {
      interfaceName: 'loading',
      isFirstTurn: false
    }

    this.gameApi = new GameApi("wss://riubi-tic-tac-toe.herokuapp.com")
    //this.gameApi = new GameApi("ws://localhost:8090")
  }

  openInterface(interfaceName) {
    this.state.interfaceName = interfaceName
    this.setState(this.state)
  }

  componentDidMount() {
    this.gameApi.getSubscriber()
      .on('open', (data) => {
        this.openInterface('lobby')
      })
      .on('error', (data) => {
        this.openInterface('error')
      })
      .on('gameStarted', (data) => {
        if (this.state.interfaceName != 'game') {
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
      case 'game': return (
        <View>
          <GameTable
            subscriber={this.gameApi.getSubscriber()}
            searchHandler={this.gameApi.searchGame()}
            moveHandler={this.gameApi.makeMove()}
            quiteHandler={this.gameApi.quite()}
            isFirstTurn={this.state.isFirstTurn}
            opponent={this.state.opponent} />
        </View>
      )
      case 'lobby': return (
        <View>
          <NickNameInput handler={this.gameApi.setName()} />
          <SearchGameButton handler={this.gameApi.searchGame()} />
        </View>
      )
      case 'error': return (
        <View><Text style={styles.title}>Something goes wrong =(</Text></View>
      )
      default: return (
        <View><Text style={styles.title}>Loading...</Text></View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tic-Tac-Toe</Text>
        {this.renderInterface()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 28,
    paddingBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'lightgray',
    marginVertical: 20,
    marginHorizontal: 20,
  }
})

export default App