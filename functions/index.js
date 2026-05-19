const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // التأكد من أن من يطلب التعديل هو مدير بالفعل (أو يمكنك تخطي هذا لأول مدير)
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can grant admin roles.');
  }

  try {
    const user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { message: `Successfully granted admin privileges to ${data.email}` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error setting custom claims.', error);
  }
});
