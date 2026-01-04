import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Pressable } from 'react-native';
import { firestore,collection,addDoc,GAMES,orderBy,serverTimestamp,query,onSnapshot,doc,deleteDoc } from './firebase/Config'
import { useEffect, useState } from 'react';

type GameItem = {
  id: string
  label: string
}

export default function App() {
  const [newGame, setNewGame] = useState<string>('')
  const [games, setGames] = useState<GameItem[]>([])

  useEffect(() => {
    const colRef = collection(firestore, GAMES)
    const gameq = query(colRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(
      gameq,
      (snap) => {
        const rows: GameItem[] = snap.docs.map((d) => {
          const data = d.data() as any
          const text = data.text ?? 'Not specified'
          const createdAt = data.createdAt?.toDate?.()
          const time = createdAt ? createdAt.toLocaleString('fi-FI') : '(pending)'

          return {
            id: d.id,
            label: `${time} - ${text}`,
          }
        })
        setGames(rows)
      },
      (err) => {
        console.error('onSnapshot error', err)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleSend = async (): Promise<void> => {
    if (!newGame.trim()) return

    try {
      const colRef = collection(firestore, GAMES)
      await addDoc(colRef, {
        text: newGame,
        createdAt: serverTimestamp(),
      })
      setNewGame('')
    } catch (err) {
      console.error('Failed to save game to Firebase', err)
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const ref = doc(firestore, GAMES, id)
      await deleteDoc(ref)
    } catch (err) {
      console.error('Failed to delete game', err)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Type a game" value={newGame} onChangeText={setNewGame} />
      <Button title="Send" onPress={handleSend} />
      <Text style={styles.title}>Games wishlist:</Text>

      {games.map((game) => (
        <View key={game.id} style={styles.row}>
          <Text style={styles.rowText}>{game.label}</Text>

          <Pressable onPress={() => handleDelete(game.id)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      ))}

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 48,
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 6,
  },
  deleteText: {
    fontWeight: '600',
  },
})