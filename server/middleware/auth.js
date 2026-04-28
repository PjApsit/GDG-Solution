/**
 * Auth Middleware — Firebase token verification
 * WHY: Every protected endpoint must verify the Firebase ID token from the client.
 * Attaches decoded user info to req.user for downstream handlers.
 * Gracefully skips auth when Firebase Admin is not configured.
 */

let adminAuth = null;
let adminDb = null;

// Only import Firebase Admin if configured
if (process.env.FIREBASE_PROJECT_ID) {
  try {
    const adminModule = await import('../config/firebase-admin.js');
    adminAuth = adminModule.adminAuth;
    adminDb = adminModule.adminDb;
  } catch (err) {
    console.warn('Firebase Admin not available:', err.message);
  }
}

/**
 * Verify Firebase ID token and attach user info to request.
 * Expects Authorization header: "Bearer <idToken>"
 */
export const verifyToken = async (req, res, next) => {
  if (!adminAuth) {
    // Firebase not configured — skip auth
    req.user = null;
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    
    // Fetch user role from Firestore
    const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: userData.role || null,
      displayName: decoded.name || userData.displayName || '',
    };

    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Optional auth — doesn't block unauthenticated requests,
 * but attaches user info if token is present.
 */
export const optionalAuth = async (req, res, next) => {
  if (!adminAuth) {
    req.user = null;
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    req.user = { uid: decoded.uid, email: decoded.email };
  } catch {
    req.user = null;
  }

  next();
};

/**
 * Role guard — restricts access to specific roles
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: `Access denied. Required role: ${roles.join(' or ')}` });
  }
  next();
};
