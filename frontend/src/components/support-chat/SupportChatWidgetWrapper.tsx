'use client';

// DEPRECATED: Apollo Client removed
const gql = (strings: TemplateStringsArray, ...values: any[]) => strings.join('');
const useQuery = () => ({ data: null, loading: false, error: null, refetch: async () => ({}) });
import SupportChatWidget from './SupportChatWidget';

const GET_SUPPORT_CHAT_SETTINGS = gql`
  query GetSupportChatSettings {
    websiteSettings(
      category: "SUPPORT_CHAT"
      isActive: true
    ) {
      key
      value
      type
    }
  }
`;

interface SupportChatSettings {
  enabled: boolean;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor: string;
  welcomeMessage: string;
  offlineMessage: string;
  aiEnabled: boolean;
  showAgentTyping: boolean;
  enableFileUpload: boolean;
  enableEmojis: boolean;
  soundNotification: boolean;
  desktopNotification: boolean;
}

export default function SupportChatWidgetWrapper() {
  const { data, loading } = useQuery(GET_SUPPORT_CHAT_SETTINGS);

  if (loading) return null;

  const settings = data?.websiteSettings || [];
  
  // Parse settings into object
  const config: Partial<SupportChatSettings> = {};
  settings.forEach((setting: any) => {
    const key = setting.key.replace('support_chat.', '');
    let value = setting.value;

    // Parse based on type
    if (setting.type === 'BOOLEAN') {
      value = value === 'true';
    } else if (setting.type === 'NUMBER') {
      value = parseFloat(value);
    } else if (setting.type === 'JSON') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error('Failed to parse JSON setting:', key, value);
      }
    }

    config[key as keyof SupportChatSettings] = value;
  });

  // Nếu disabled, không render widget
  if (config.enabled === false) {
    return null;
  }

  // Get API URLs from env
  const apiUrl = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.replace('/graphql', '') || 
                 "http://116.118.49.243:12001";
  const websocketUrl = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.replace('/graphql', '/support-chat') || 
                       "http://116.118.49.243:12001/support-chat";

  return (
    <SupportChatWidget
      apiUrl={apiUrl}
      websocketUrl={websocketUrl}
      primaryColor={config.primaryColor || '#16a34a'}
      position={(config.position as 'bottom-right' | 'bottom-left') || 'bottom-right'}
    />
  );
}
