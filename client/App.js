import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import NickNameInput from './component/nick-name-input.js'
import SearchGameButton from './component/search-game-button.js'
import GameTable from './component/game-table.js'
import GameApi from './sdk/game-api.js'

export class App extends React.Component {
  constructor() {
    super()

    this.state = {
      showLobby: true,
      isFirstTurn: false
    }

    this.gameApi = new GameApi("ws://localhost:8090")
  }

  componentDidMount() {
    this.gameApi.getSubscriber().on('gameStarted', (data) => {
      if (this.state.showLobby) {
        this.setState({
          showLobby: false,
          isFirstTurn: data.isYourTurn,
          opponent: data.opponent,
        })
      }
    })
  }

  render() {
    const template = this.state.showLobby
      ? (
        <View>
          <NickNameInput handler={this.gameApi.setName()} />
          <SearchGameButton handler={this.gameApi.searchGame()} />
        </View>
      )
      : (
        <View>
          <GameTable
            subscriber={this.gameApi.getSubscriber()}
            searchHandler={this.gameApi.searchGame()}
            moveHandler={this.gameApi.makeMove()}
            isFirstTurn={this.state.isFirstTurn}
            opponent={this.state.opponent} />
        </View>
      )

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tic-Tac-Toe</Text>
        {template}
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