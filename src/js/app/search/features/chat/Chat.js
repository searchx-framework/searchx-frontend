import "./Chat.pcss";
import AccountStore from "../../../../stores/AccountStore";

const Chat = function() {
    const chatRoom = 'searchx-' + AccountStore.getSessionId() + '@conference.nomnom.im';

    /* global converse */
    converse.initialize({
        authentication: 'anonymous',
        auto_login: true,
        auto_reconnect: true,

        allow_logout: false,
        allow_muc_invitations: false,
        allow_contact_requests: false,
        allow_bookmarks: false,
        allow_registration: false,
        allow_muc: false,

        auto_join_rooms: [chatRoom],
        notify_all_room_messages: [chatRoom],
        bosh_service_url: 'https://conversejs.org/http-bind/', //TODO: change to own server
        jid: 'nomnom.im',

        use_emojione: false,
        keepalive: true,
        hide_muc_server: true,
        play_sounds: true,
        synchronize_availability: false,
        show_controlbox_by_default: false,
        show_desktop_notifications: false,
        strict_plugin_dependencies: false,

        visible_toolbar_buttons: {
            call: false,
            clear: false,
            toggle_occupants: false,
            emoji: false
        },

        blacklisted_plugins: [
            'converse-dragresize',
            'converse-vcard',
            'converse-notification',
            'converse-register',
            'converse-bookmarks'
        ]
    });
};

export default Chat;