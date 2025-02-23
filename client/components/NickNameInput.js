import React from 'react'
import {SafeAreaView, StyleSheet, TextInput} from "react-native"

export default function NickNameInput({handler}) {
    const [name, setName] = React.useState('')

    return (
        <SafeAreaView>
            <TextInput
                style={styles.input}
                onChangeText={setName}
                onBlur={() => handler(name)}
                placeholder="Your nick or name"
                value={name}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 20,
        borderWidth: 1,
        textAlign: 'center',
        borderColor: 'lightgray',
        color: 'gray',
        padding: 10,
    },
})