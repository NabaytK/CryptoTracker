import { auth, db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';

export interface Transaction {
  id: string;
  coinId: string;
  coinSymbol: string;
  coinName: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  date: string;
}

export interface PortfolioHolding {
  coinId: string;
  coinSymbol: string;
  coinName: string;
  totalAmount: number;
  totalCost: number;
}

function txCollection() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not logged in');
  return collection(db, 'users', uid, 'transactions');
}

// reads all saved trades for the logged in user from firestore
export async function loadTransactions(): Promise<Transaction[]> {
  try {
    const snap = await getDocs(query(txCollection(), orderBy('date', 'desc')));
    return snap.docs.map(d => d.data() as Transaction);
  } catch { return []; }
}

// adds a new buy or sell trade to firestore
export async function addTransaction(tx: Transaction): Promise<void> {
  await setDoc(doc(txCollection(), tx.id), tx);
}

// deletes a trade from firestore using its id
export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(txCollection(), id));
}

// goes through all trades and works out what the user currently holds
export async function loadPortfolio(): Promise<PortfolioHolding[]> {
  const txs = await loadTransactions();
  const map: Record<string, PortfolioHolding> = {};
  for (const tx of txs) {
    if (!map[tx.coinId]) map[tx.coinId] = { coinId: tx.coinId, coinSymbol: tx.coinSymbol, coinName: tx.coinName, totalAmount: 0, totalCost: 0 };
    if (tx.type === 'buy') { map[tx.coinId].totalAmount += tx.amount; map[tx.coinId].totalCost += tx.amount * tx.price; }
    else { map[tx.coinId].totalAmount -= tx.amount; map[tx.coinId].totalCost -= tx.amount * tx.price; }
  }
  return Object.values(map).filter(h => h.totalAmount > 0.000001);
}

export async function loadHoldings(): Promise<PortfolioHolding[]> {
  return loadPortfolio();
}

export async function clearAllData(): Promise<void> {
  const txs = await loadTransactions();
  await Promise.all(txs.map(tx => deleteTransaction(tx.id)));
}
