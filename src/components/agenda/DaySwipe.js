import React, { useMemo, useRef, useEffect } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../theme/colors';

const RANGE = 365;
const ITEM_WIDTH = 74;

export default function DaySwipe({ selectedDate, onChange }) {
  const listRef = useRef(null);
  const didInitialScroll = useRef(false);

  const selected = new Date(selectedDate + 'T00:00:00');

  const days = useMemo(() => {
    return Array.from({ length: RANGE * 2 }, (_, i) => {
      const d = new Date(selected);
      d.setDate(selected.getDate() + i - RANGE);
      return d;
    });
  }, [selectedDate]);

  const scrollToCenter = (animated = true) => {
    if (!listRef.current) return;

    listRef.current.scrollToIndex({
      index: RANGE,
      viewPosition: 0.5,
      animated
    });
  };

  // ✅ SOLUCIÓN REAL
  useEffect(() => {
    if (didInitialScroll.current) {
      scrollToCenter(true);
      return;
    }

    didInitialScroll.current = true;

    requestAnimationFrame(() => {
      setTimeout(() => {
        scrollToCenter(false); // 👈 al entrar desde BottomNav
      }, 0);
    });
  }, [selectedDate]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={listRef}
        horizontal
        data={days}
        keyExtractor={(item) => item.toISOString()}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={RANGE}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index
        })}
        renderItem={({ item }) => {
          const iso = item.toISOString().split('T')[0];
          const active = iso === selectedDate;

          return (
            <TouchableOpacity
              onPress={() => onChange(iso)}
              style={[styles.day, active && styles.active]}
            >
              <Text style={[styles.weekday, active && styles.activeText]}>
                {item.toLocaleDateString('es-CR', { weekday: 'short' })}
              </Text>

              <Text style={[styles.number, active && styles.activeText]}>
                {item.getDate()}
              </Text>

              <Text style={[styles.meta, active && styles.activeText]}>
                {`${String(item.getMonth() + 1).padStart(2, '0')}/${String(item.getFullYear()).slice(-2)}`}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 110,
    justifyContent: 'center'
  },
  day: {
    width: 64,
    height: 90,
    backgroundColor: Colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  active: {
    backgroundColor: Colors.primary
  },
  weekday: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'capitalize'
  },
  number: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: Colors.textPrimary
  },
  meta: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 10,
    color: Colors.textSecondary
  },
  activeText: {
    color: Colors.white
  }
});