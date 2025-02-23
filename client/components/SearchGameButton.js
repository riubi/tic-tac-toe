import React from 'react'
import {Button, SafeAreaView} from "react-native"

export default function SearchGameButton({handler}) {
    const [wasPressed, pressButton] = React.useState(false)

    return (
        <SafeAreaView>
            <Button
                onPress={() => {
                    handler()
                    pressButton(true)
                }}
                color={wasPressed ? 'lightgray' : 'steelblue'}
                title={wasPressed ? 'Searching' : 'Search game'}
            >
            </Button>
        </SafeAreaView>
    )
}