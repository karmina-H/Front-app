import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FamouseListScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.first}>FamouseListScreen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    first: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default FamouseListScreen;
