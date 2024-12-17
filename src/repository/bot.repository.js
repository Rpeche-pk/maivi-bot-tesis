export const createOrUpdate = async (payload) => {
    const {ctx, device, token,db} = payload;
    const data= {
        phoneNumber: ctx?.from,
        pushName: ctx?.pushName ?? ctx?.key?.remoteJid,
        remoteJid: ctx?.key?.remoteJid,
        device,
        token
    }
    await db.updateOne({phoneNumber: ctx?.from},{...data},{upsert: true});
}

export const findByPhone = async (phone,db) => {
    return db.findOne({phoneNumber: phone});
}

export const getPhoneNumbers = async (db) => {
    try {
        const phoneNumbers = await db.find({}, { remoteJid: 1, _id: 0 });
        return phoneNumbers.map(doc => doc.remoteJid);
    } catch (error) {
        console.error("Error fetching phone numbers:", error.message);
        throw error;
    }
};
