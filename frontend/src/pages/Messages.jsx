import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { messagesAPI } from '../utils/api';
import { Send, Search, MessageCircle } from 'lucide-react';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [conversationActive, setConversationActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [recherche, setRecherche] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    chargerConversations();
  }, [user, navigate]);

  useEffect(() => {
    if (conversationActive) {
      chargerMessages(conversationActive.autreUtilisateur._id);
    }
  }, [conversationActive]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const chargerConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data.conversations);
      
      if (response.data.conversations.length > 0 && !conversationActive) {
        setConversationActive(response.data.conversations[0]);
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    }
    setLoading(false);
  };

  const chargerMessages = async (autreUserId) => {
    try {
      const response = await messagesAPI.getConversation(autreUserId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim() || !conversationActive) return;

    try {
      await messagesAPI.send({
        destinataire: conversationActive.autreUtilisateur._id,
        contenu: nouveauMessage
      });

      setNouveauMessage('');
      chargerMessages(conversationActive.autreUtilisateur._id);
      chargerConversations();
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  const conversationsFiltrees = conversations.filter(conv =>
    conv.autreUtilisateur.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    conv.autreUtilisateur.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
    conv.autreUtilisateur.entreprise?.nom?.toLowerCase().includes(recherche.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messagerie</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
        {/* Liste conversations */}
        <div className="lg:col-span-1 card flex flex-col h-full">
          {/* Recherche */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversationsFiltrees.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Aucune conversation</p>
              </div>
            ) : (
              conversationsFiltrees.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => setConversationActive(conv)}
                  className={`w-full text-left p-4 rounded-lg transition ${
                    conversationActive?.conversationId === conv.conversationId
                      ? 'bg-primary-50 border-2 border-primary-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {conv.autreUtilisateur.prenom[0]}{conv.autreUtilisateur.nom[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {conv.autreUtilisateur.prenom} {conv.autreUtilisateur.nom}
                        </p>
                        {conv.messagesNonLus > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {conv.messagesNonLus}
                          </span>
                        )}
                      </div>
                      {conv.autreUtilisateur.entreprise?.nom && (
                        <p className="text-xs text-gray-500 truncate mb-1">
                          {conv.autreUtilisateur.entreprise.nom}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 truncate">
                        {conv.dernierMessage.contenu}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="lg:col-span-2 card flex flex-col h-full">
          {conversationActive ? (
            <>
              {/* Header chat */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    {conversationActive.autreUtilisateur.prenom[0]}{conversationActive.autreUtilisateur.nom[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {conversationActive.autreUtilisateur.prenom} {conversationActive.autreUtilisateur.nom}
                    </h3>
                    {conversationActive.autreUtilisateur.entreprise?.nom && (
                      <p className="text-sm text-gray-600">
                        {conversationActive.autreUtilisateur.entreprise.nom}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((msg) => {
                  const estMonMessage = msg.expediteur._id === user._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${estMonMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          estMonMessage
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.contenu}</p>
                        <p className={`text-xs mt-1 ${estMonMessage ? 'text-primary-100' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('fr-MA', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input message */}
              <form onSubmit={envoyerMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={nouveauMessage}
                  onChange={(e) => setNouveauMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 input-field"
                />
                <button
                  type="submit"
                  disabled={!nouveauMessage.trim()}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Envoyer</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Sélectionnez une conversation pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;