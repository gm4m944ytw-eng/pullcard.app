const SUPABASE_URL = 'https://lxuhkhdipcpiortpndny.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dWhraGRpcGNwaW9ydHBuZG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NTI3MjMsImV4cCI6MjA5NjAyODcyM30.yUGIJvP6WfSrTYZAYAuhRwe9unwcoEvT4yD_OixDnIE';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const actionButton = document.getElementById('action-button');

actionButton.addEventListener('click', async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
        const properties = ['name', 'tel', 'email'];
        try {
            const selectedContacts = await navigator.contacts.select(properties, { multiple: true });
            if (selectedContacts.length > 0) {
                await sendToSupabase(selectedContacts);
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        alert('The Contact Picker API is not supported on this specific device or browser.');
    }
});

async function sendToSupabase(contactsArray) {
    const dataToSave = contactsArray.map(contact => {
        return {
            name: contact.name ? contact.name.join(' ') : null,
            phone: contact.tel ? contact.tel.join(', ') : null,
            email: contact.email ? contact.email.join(', ') : null
        };
    });

    const { data, error } = await supabase
        .from('buckets')
        .insert(dataToSave);

    if (error) {
        console.error(error.message);
    } else {
        console.log('Success');
    }
}
