import React from 'react'
import {Text, StyleSheet} from "react-native"
import Config from "../config"

export default function MadeBy() {
    return (<Text style={styles.madeBy}>Made by <Text style={styles.profile}
                                                      href={Config.AUTHOR_URL}>{Config.AUTHOR_NAME}</Text></Text>)
}

const styles = StyleSheet.create({
    profile: {
        fontWeight: 'bold',
    }, madeBy: {
        textAlign: 'center', color: 'lightgray', fontSize: 12, paddingTop: 30,
    }
})