import React from "react";
import {
    StyleSheet,
    GestureResponderEvent,
    Text,
    Pressable,
} from "react-native";

export interface ButtonProps {
    text: string;
    onClick?: (event: GestureResponderEvent) => void;
}

export function Button({ text, onClick }: ButtonProps) {
    return (
        <Pressable onPress={onClick}>
            <Text style={styles.button}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
    },
});
