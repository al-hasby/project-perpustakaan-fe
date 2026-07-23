<template>
  <!-- Tombol Chat -->
  <button @click="isOpen = !isOpen" class="chatbot-toggle" :class="{ active: isOpen }">
    <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
    <!-- Pulse indicator saat tertutup -->
    <span v-if="!isOpen" class="chatbot-pulse"></span>
  </button>

  <!-- Jendela Chat -->
  <Transition name="chat-window">
    <div v-if="isOpen" class="chatbot-window">
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">📚</div>
          <div>
            <span class="chatbot-title">Asisten Perpus</span>
            <span class="chatbot-status">Online</span>
          </div>
        </div>
        <div class="chatbot-header-actions">
          <button @click="clearHistory" class="chatbot-header-btn" title="Hapus Riwayat">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
          <button @click="isOpen = false" class="chatbot-header-btn" title="Tutup">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Area Pesan -->
      <div class="chatbot-messages" ref="chatContainer">
        <TransitionGroup name="msg">
          <div
            v-for="(msg, index) in messages"
            :key="msg.id"
            :class="['chatbot-msg', msg.sender === 'bot' ? 'msg-bot' : 'msg-user']"
          >
            <div v-if="msg.sender === 'bot'" class="chatbot-msg-avatar">📚</div>
            <span class="chatbot-bubble" :class="msg.sender === 'bot' ? 'bubble-bot' : 'bubble-user'">
              {{ msg.text }}
            </span>
          </div>
        </TransitionGroup>

        <!-- Typing indicator -->
        <Transition name="msg">
          <div v-if="isTyping" class="chatbot-msg msg-bot">
            <div class="chatbot-msg-avatar">📚</div>
            <span class="chatbot-bubble bubble-bot typing-bubble">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </span>
          </div>
        </Transition>
      </div>

      <!-- Quick Actions -->
      <div class="chatbot-quick-actions">
        <button @click="quickAsk('buku apa saja yang ada')" class="quick-btn">📖 Daftar Buku</button>
        <button @click="quickAsk('cara pinjam buku')" class="quick-btn">📝 Cara Pinjam</button>
        <button @click="quickAsk('jam buka')" class="quick-btn">🕐 Jam Buka</button>
      </div>

      <!-- Input Area -->
      <div class="chatbot-input-area">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          class="chatbot-input"
          placeholder="Tanya sesuatu..."
        />
        <button @click="sendMessage" class="chatbot-send" :disabled="!userInput.trim()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { getData } from '@/data/store.js';

const isOpen = ref(false);
const userInput = ref('');
const chatContainer = ref(null);
const books = ref([]);
const isTyping = ref(false);
let msgIdCounter = 0;

onMounted(() => {
  const data = getData();
  books.value = data.books || [];
});

const messages = ref([
  { id: ++msgIdCounter, sender: 'bot', text: 'Halo! Saya asisten virtual perpustakaan. Ada yang bisa saya bantu hari ini?' }
]);

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const quickAsk = (text) => {
  userInput.value = text;
  sendMessage();
};

const clearHistory = () => {
  messages.value = [
    { id: ++msgIdCounter, sender: 'bot', text: 'Riwayat sudah dihapus. Ada yang bisa saya bantu lagi?' }
  ];
};

const sendMessage = () => {
  const text = userInput.value.trim();
  if (!text || isTyping.value) return;

  messages.value.push({ id: ++msgIdCounter, sender: 'user', text });
  userInput.value = '';
  scrollToBottom();

  isTyping.value = true;
  scrollToBottom();

  setTimeout(() => {
    const botReply = getBotReply(text);
    isTyping.value = false;
    messages.value.push({ id: ++msgIdCounter, sender: 'bot', text: botReply });
    scrollToBottom();
  }, 800);
};

const getBotReply = (text) => {
  const lower = text.toLowerCase();

  if (lower.includes('buku apa') || lower.includes('daftar buku') || lower.includes('list buku') || lower.includes('buku yang ada') || lower.includes('buku tersedia') || lower.includes('koleksi buku')) {
    const list = books.value.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang} (Stok: ${b.stok})`).join('\n');
    return `Berikut daftar buku yang tersedia di perpustakaan kami:\n\n${list}\n\nMau tahu lebih detail tentang buku tertentu?`;
  }

  if (lower.includes('novel')) {
    const found = books.value.filter(b => b.kategori.toLowerCase() === 'novel');
    if (found.length) return `Buku kategori Novel:\n${found.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang}`).join('\n')}\n\nTertarik meminjam?`;
    return 'Maaf, saat ini tidak ada buku novel yang tersedia.';
  }

  if (lower.includes('sains')) {
    const found = books.value.filter(b => b.kategori.toLowerCase() === 'sains');
    if (found.length) return `Buku kategori Sains:\n${found.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang}`).join('\n')}\n\nTertarik meminjam?`;
    return 'Maaf, saat ini tidak ada buku sains yang tersedia.';
  }

  if (lower.includes('self help') || lower.includes('self-help') || lower.includes('motivasi')) {
    const found = books.value.filter(b => b.kategori.toLowerCase() === 'self help');
    if (found.length) return `Buku kategori Self Help:\n${found.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang}`).join('\n')}\n\nTertarik meminjam?`;
    return 'Maaf, saat ini tidak ada buku self help yang tersedia.';
  }

  if (lower.includes('filsafat') || lower.includes('filosofi')) {
    const found = books.value.filter(b => b.kategori.toLowerCase() === 'filsafat');
    if (found.length) return `Buku kategori Filsafat:\n${found.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang}`).join('\n')}\n\nTertarik meminjam?`;
    return 'Maaf, saat ini tidak ada buku filsafat yang tersedia.';
  }

  if (lower.includes('teknologi') || lower.includes('coding') || lower.includes('komputer') || lower.includes('program')) {
    const found = books.value.filter(b => b.kategori.toLowerCase() === 'teknologi');
    if (found.length) return `Buku kategori Teknologi:\n${found.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang}`).join('\n')}\n\nTertarik meminjam?`;
    return 'Maaf, saat ini tidak ada buku teknologi yang tersedia.';
  }

  if (lower.includes('biografi') || lower.includes('tokoh')) {
    const found = books.value.filter(b => b.kategori.toLowerCase() === 'biografi');
    if (found.length) return `Buku kategori Biografi:\n${found.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang}`).join('\n')}\n\nTertarik meminjam?`;
    return 'Maaf, saat ini tidak ada buku biografi yang tersedia.';
  }

  if (lower.includes('manga') || lower.includes('komik') || lower.includes('anime')) {
    const found = books.value.filter(b => b.kategori.toLowerCase() === 'manga' || b.kategori.toLowerCase() === 'komik');
    if (found.length) return `Buku kategori Manga & Komik:\n${found.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang}`).join('\n')}\n\nTertarik meminjam?`;
    return 'Maaf, saat ini tidak ada manga/komik yang tersedia.';
  }

  if (lower.includes('fiksi')) {
    const found = books.value.filter(b => b.kategori.toLowerCase() === 'fiksi');
    if (found.length) return `Buku kategori Fiksi:\n${found.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang}`).join('\n')}\n\nTertarik meminjam?`;
    return 'Maaf, saat ini tidak ada buku fiksi yang tersedia.';
  }

  if (lower.includes('sejarah')) {
    const found = books.value.filter(b => b.kategori.toLowerCase() === 'sejarah');
    if (found.length) return `Buku kategori Sejarah:\n${found.map((b, i) => `${i + 1}. ${b.judul} - ${b.pengarang}`).join('\n')}\n\nTertarik meminjam?`;
    return 'Maaf, saat ini tidak ada buku sejarah yang tersedia.';
  }

  if (lower.includes('cari buku') || lower.includes('search') || lower.includes('cari')) {
    return 'Silakan gunakan menu Books untuk mencari buku. Kamu bisa mengetik judul atau pengarang di kolom pencarian pada halaman Books.';
  }

  if (lower.includes('pinjam') || lower.includes('cara pinjam') || lower.includes('meminjam')) {
    return 'Untuk meminjam buku:\n1. Login ke akun kamu\n2. Buka menu "Books"\n3. Klik detail buku yang diinginkan\n4. Klik tombol "Pinjam"\n5. Tunggu persetujuan admin\n\nSelamat membaca!';
  }

  if (lower.includes('kembali') || lower.includes('denda') || lower.includes('terlambat')) {
    return 'Buku harus dikembalikan maksimal 7 hari setelah peminjaman. Jika terlambat, akan ada denda sesuai aturan perpustakaan. Pengembalian dilakukan melalui menu "Borrow" oleh petugas.';
  }

  if (lower.includes('stok') || lower.includes('habis') || lower.includes('kosong')) {
    return 'Jika stok buku kosong, kamu harus menunggu sampai member lain mengembalikannya. Cek terus halaman buku untuk update ketersediaan!';
  }

  if (lower.includes('jam') || lower.includes('buka') || lower.includes('operasional') || lower.includes('jam buka')) {
    return 'Perpustakaan kami buka:\nSenin - Jumat\n08:00 - 16:00 WIB\n\nTutup pada hari Sabtu, Minggu, dan hari libur nasional.';
  }

  if (lower.includes('ebook') || lower.includes('e-book') || lower.includes('digital') || lower.includes('pdf')) {
    return 'Kami menyediakan e-book yang bisa diakses secara online! Buka menu "E-Books" untuk melihat koleksi e-book yang tersedia. Kamu bisa membacanya langsung di browser.';
  }

  if (lower.includes('halo') || lower.includes('hai') || lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Halo juga! Mau tanya tentang:\n- Daftar buku yang tersedia\n- Cara meminjam buku\n- Jam buka perpustakaan\n- E-book\n- atau yang lainnya?';
  }

  if (lower.includes('terima kasih') || lower.includes('makasih') || lower.includes('thanks') || lower.includes('thank')) {
    return 'Sama-sama! Senang bisa membantu. Jangan ragu bertanya lagi ya!';
  }

  if (lower.includes('bantuan') || lower.includes('help') || lower.includes('bisa apa')) {
    return 'Saya bisa membantu kamu dengan:\n- Melihat daftar buku\n- Mencari buku per kategori\n- Cara meminjam buku\n- Jam operasional perpustakaan\n- Informasi e-book\n\nSilakan tanyakan apa saja!';
  }

  if (lower.includes('kategori') || lower.includes('jenis')) {
    const kategori = [...new Set(books.value.map(b => b.kategori))];
    return `Kategori buku yang tersedia:\n${kategori.map((k, i) => `${i + 1}. ${k}`).join('\n')}\n\nKetik nama kategori untuk melihat daftar bukunya!`;
  }

  if (lower.includes('berapa stok') || lower.includes('stok tersisa')) {
    const lowStock = books.value.filter(b => b.stok <= 3);
    const inStock = books.value.filter(b => b.stok > 3);
    return `Ringkasan stok buku:\n\nStok aman (>3): ${inStock.length} judul\nStok tipis (${'<='}3): ${lowStock.length} judul\n${lowStock.length ? '\nBuku stok tipis:\n' + lowStock.map(b => `- ${b.judul} (sisa ${b.stok})`).join('\n') : ''}`;
  }

  if (lower.includes('total') || lower.includes('berapa banyak') || lower.includes('jumlah buku')) {
    return `Perpustakaan kami memiliki total ${books.value.length} judul buku fisik dan 3 e-book. Ada ${[...new Set(books.value.map(b => b.kategori))].length} kategori berbeda.`;
  }

  return 'Maaf, saya belum mengerti pertanyaan kamu. Coba tanyakan tentang:\n- "buku apa saja" - daftar koleksi\n- "cara pinjam" - tata cara peminjaman\n- "jam buka" - jam operasional\n- "ebook" - koleksi digital\n- "kategori" - jenis buku yang tersedia';
};
</script>

<style scoped>
.chatbot-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

.chatbot-pulse {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  background: #22C55E;
  border-radius: 50%;
  border: 2px solid #fff;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.chatbot-toggle:hover {
  background: var(--color-primary-dark);
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.5);
}

.chatbot-toggle.active {
  background: #EF4444;
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
}

.chatbot-toggle.active:hover {
  background: #DC2626;
  box-shadow: 0 6px 24px rgba(239, 68, 68, 0.5);
}

/* Window Transition */
.chat-window-enter-active {
  animation: chatSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-window-leave-active {
  animation: chatSlideUp 0.2s ease reverse;
}

@keyframes chatSlideUp {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chatbot-window {
  position: fixed;
  bottom: 92px;
  right: 24px;
  width: 360px;
  max-height: 520px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 999;
}

/* Header */
.chatbot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: var(--color-primary);
  color: #fff;
}

.chatbot-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chatbot-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-size: 18px;
}

.chatbot-title {
  display: block;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}

.chatbot-status {
  display: block;
  font-size: 11px;
  opacity: 0.85;
}

.chatbot-header-actions {
  display: flex;
  gap: 4px;
}

.chatbot-header-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.chatbot-header-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Messages */
.chatbot-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #F8FAFC;
  max-height: 300px;
}

/* Message Transition */
.msg-enter-active {
  animation: msgIn 0.3s ease;
}

.msg-leave-active {
  animation: msgIn 0.2s ease reverse;
}

@keyframes msgIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chatbot-msg {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.chatbot-msg.msg-bot {
  justify-content: flex-start;
}

.chatbot-msg.msg-user {
  justify-content: flex-end;
}

.chatbot-msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-light);
  display: grid;
  place-items: center;
  font-size: 14px;
  flex-shrink: 0;
}

.chatbot-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-line;
  word-break: break-word;
}

.bubble-bot {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-bottom-left-radius: 4px;
}

.bubble-user {
  background: var(--color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

/* Typing indicator */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 18px;
}

.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-text-muted);
  animation: typingBounce 1.4s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* Quick Actions */
.chatbot-quick-actions {
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  border-top: 1px solid var(--color-border);
  overflow-x: auto;
  background: var(--color-surface);
}

.quick-btn {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.quick-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

/* Input */
.chatbot-input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.chatbot-input {
  flex: 1;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 0 14px;
  font-size: 13px;
  color: var(--color-text);
  background: #F8FAFC;
  transition: border-color 0.2s;
}

.chatbot-input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.chatbot-input::placeholder {
  color: var(--color-text-muted);
}

.chatbot-send {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.chatbot-send:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.chatbot-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 480px) {
  .chatbot-window {
    width: calc(100vw - 32px);
    right: 16px;
    bottom: 84px;
    max-height: 70vh;
  }

  .chatbot-toggle {
    bottom: 16px;
    right: 16px;
  }
}
</style>
