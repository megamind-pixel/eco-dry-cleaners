import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Wind, Package, Shirt, Zap, CheckCircle, Tag, ArrowRight, ArrowLeft, Camera, X as CloseIcon } from 'lucide-react';

const SERVICES = [
  { id: 'dry-cleaning', name: 'Dry Cleaning', icon: <Wind size={28} />, desc: 'Professional care for delicate items' },
  { id: 'wash-fold', name: 'Wash & Fold', icon: <Package size={28} />, desc: 'Full wash, dry, and fold service' },
  { id: 'ironing', name: 'Ironing', icon: <Shirt size={28} />, desc: 'Crisp, wrinkle-free results' },
  { id: 'express', name: 'Express Laundry', icon: <Zap size={28} />, desc: 'Same-day turnaround' },
];

const PACKAGES = [
  { id: 'standard', name: 'Standard', price: 500, desc: '3–5 day delivery', features: ['Up to 5kg', 'Basic care', 'Standard delivery'] },
  { id: 'premium', name: 'Premium', price: 800, desc: '1–2 day delivery', features: ['Up to 10kg', 'Premium detergent', 'Express delivery', 'Stain treatment'] },
  { id: 'express', name: 'Express', price: 1200, desc: 'Same day delivery', features: ['Up to 15kg', 'Priority handling', 'Same-day delivery', 'Free delivery fee'] },
];

const COUPONS = { FIRSTWASH: 20, ECO10: 10, SAVE15: 15 };

const DELIVERY_FEE = 150;

export default function Booking() {
  const { user, addOrder } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    serviceType: '', package: '', pickupDate: '', deliveryDate: '',
    pickupLocation: '', quantity: 1, coupon: '', images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [couponMsg, setCouponMsg] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedPkg = PACKAGES.find(p => p.id === form.package);
  const subtotal = selectedPkg ? selectedPkg.price * form.quantity : 0;
  const discountAmt = Math.round(subtotal * (discount / 100));
  const total = subtotal + DELIVERY_FEE - discountAmt;

  const applyCoupon = () => {
    const pct = COUPONS[form.coupon.toUpperCase()];
    if (pct) {
      setDiscount(pct);
      setCouponMsg({ type: 'success', text: `${pct}% discount applied!` });
    } else {
      setDiscount(0);
      setCouponMsg({ type: 'error', text: 'Invalid coupon code.' });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 5) {
      alert('You can only upload up to 5 images.');
      return;
    }
    setImageFiles([...imageFiles, ...files]);
  };

  const removeImage = (index) => {
    const updated = [...imageFiles];
    updated.splice(index, 1);
    setImageFiles(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const order = await addOrder({
        serviceType: SERVICES.find(s => s.id === form.serviceType)?.name,
        package: form.package,
        pickupDate: form.pickupDate,
        deliveryDate: form.deliveryDate,
        pickupLocation: form.pickupLocation,
        quantity: form.quantity,
        coupon: form.coupon,
        discount: discountAmt,
        deliveryFee: DELIVERY_FEE,
        subtotal,
        total,
        images: imageFiles, 
      });
      setSuccess(order);
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.successPage}>
        <div className="card" style={styles.successCard}>
          <div style={styles.successIcon}><CheckCircle size={64} color="#52B788" /></div>
          <h2 style={styles.successTitle}>Booking Confirmed!</h2>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>Your order has been placed successfully.</p>
          <div style={styles.successOrderId}>Order ID: <strong>{success.id}</strong></div>
          <div style={styles.successDetails}>
            <div><span>Service:</span> <strong>{success.serviceType}</strong></div>
            <div><span>Package:</span> <strong>{success.package}</strong></div>
            <div><span>Pickup:</span> <strong>{success.pickupDate}</strong></div>
            <div><span>Total:</span> <strong>KES {success.total}</strong></div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => navigate(`/payment/${success.id}`)}>Pay Now</button>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#1B4332' }}>Login Required</h2>
        <p style={{ color: '#6B7280' }}>Please login to book a service.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Book a Laundry Service</h1>
          <p style={{ color: '#6B7280' }}>Schedule your pickup and delivery</p>
        </div>

        {/* Progress Steps */}
        <div style={styles.progress}>
          {['Service', 'Details', 'Summary'].map((s, i) => (
            <div key={s} style={styles.progressStep}>
              <div style={{ ...styles.progressDot, ...(step >= i+1 ? styles.progressActive : {}) }}>{i + 1}</div>
              <span style={{ fontSize: 13, color: step >= i+1 ? '#2D6A4F' : '#9CA3AF', fontWeight: step === i+1 ? 600 : 400 }}>{s}</span>
              {i < 2 && <div style={styles.progressLine}></div>}
            </div>
          ))}
        </div>

        <div style={styles.layout}>
          <div style={styles.formArea}>

            {/* Step 1: Service */}
            {step === 1 && (
              <div className="card">
                <h2 style={styles.stepTitle}>Select Service Type</h2>
                <div style={styles.servicesGrid}>
                  {SERVICES.map(s => (
                    <div key={s.id} onClick={() => setForm({...form, serviceType: s.id})}
                      style={{ ...styles.serviceCard, ...(form.serviceType === s.id ? styles.serviceSelected : {}) }}>
                      <div style={styles.serviceIcon}>{s.icon}</div>
                      <div style={styles.serviceName}>{s.name}</div>
                      <div style={styles.serviceDesc}>{s.desc}</div>
                    </div>
                  ))}
                </div>

                {form.serviceType && (
                  <>
                    <h2 style={{ ...styles.stepTitle, marginTop: 32 }}>Choose Package</h2>
                    <div style={styles.packagesGrid}>
                      {PACKAGES.map(p => (
                        <div key={p.id} onClick={() => setForm({...form, package: p.id})}
                          style={{ ...styles.packageCard, ...(form.package === p.id ? styles.packageSelected : {}) }}>
                          <div style={styles.packageName}>{p.name}</div>
                          <div style={styles.packagePrice}>KES {p.price}<span style={{ fontSize: 12, fontWeight: 400 }}>/order</span></div>
                          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>{p.desc}</div>
                          {p.features.map(f => (
                            <div key={f} style={styles.packageFeature}><CheckCircle size={12} color="#52B788" /> {f}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ marginTop: 24 }}>
                  <button className="btn btn-primary" disabled={!form.serviceType || !form.package}
                    onClick={() => setStep(2)}>
                    Next: Details <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="card">
                <h2 style={styles.stepTitle}>Booking Details</h2>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Pickup Date</label>
                    <input className="form-control" type="date" value={form.pickupDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setForm({...form, pickupDate: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Delivery Date</label>
                    <input className="form-control" type="date" value={form.deliveryDate}
                      min={form.pickupDate || new Date().toISOString().split('T')[0]}
                      onChange={e => setForm({...form, deliveryDate: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pickup Location (Address)</label>
                  <input className="form-control" type="text" placeholder="e.g. 123 Green St, Westlands, Nairobi"
                    value={form.pickupLocation} onChange={e => setForm({...form, pickupLocation: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Clothing Quantity (kg or pieces)</label>
                  <input className="form-control" type="number" min={1} max={50}
                    value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} />
                </div>

                <div className="form-group">
                  <label>Upload Clothing Images (Optional)</label>
                  <div style={styles.imageUploadArea}>
                    <label style={styles.imageUploadBtn}>
                      <Camera size={24} />
                      <span>Add Photos</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                    <div style={styles.imagePreviewGrid}>
                      {imageFiles.map((file, i) => (
                        <div key={i} style={styles.imagePreview}>
                          <img src={URL.createObjectURL(file)} alt="preview" style={styles.previewImg} />
                          <button style={styles.removeImgBtn} onClick={() => removeImage(i)}><CloseIcon size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Maximum 5 images. Helps us assess fabric care.</p>
                </div>

                <div className="form-group">
                  <label>Apply Coupon Code <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input className="form-control" type="text" placeholder="e.g. FIRSTWASH"
                      value={form.coupon} onChange={e => { setForm({...form, coupon: e.target.value}); setCouponMsg(null); }} />
                    <button className="btn btn-outline" type="button" onClick={applyCoupon}>
                      <Tag size={16} /> Apply
                    </button>
                  </div>
                  {couponMsg && <div className={`alert alert-${couponMsg.type === 'success' ? 'success' : 'error'}`} style={{ marginTop: 8, marginBottom: 0 }}>{couponMsg.text}</div>}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}><ArrowLeft size={18} /> Back</button>
                  <button className="btn btn-primary" disabled={!form.pickupDate || !form.deliveryDate || !form.pickupLocation}
                    onClick={() => setStep(3)}>
                    Review Order <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Summary */}
            {step === 3 && (
              <div className="card">
                <h2 style={styles.stepTitle}>Order Summary</h2>
                <div style={styles.summaryGrid}>
                  {[
                    ['Service', SERVICES.find(s => s.id === form.serviceType)?.name],
                    ['Package', form.package],
                    ['Quantity', form.quantity + ' kg/pieces'],
                    ['Pickup Date', form.pickupDate],
                    ['Delivery Date', form.deliveryDate],
                    ['Location', form.pickupLocation],
                  ].map(([k, v]) => (
                    <div key={k} style={styles.summaryRow}>
                      <span style={{ color: '#6B7280' }}>{k}</span>
                      <span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.pricingBreakdown}>
                  <div style={styles.priceRow}><span>Subtotal</span><span>KES {subtotal}</span></div>
                  <div style={styles.priceRow}><span>Delivery Fee</span><span>KES {DELIVERY_FEE}</span></div>
                  {discountAmt > 0 && <div style={{ ...styles.priceRow, color: '#10B981' }}><span>Discount ({discount}%)</span><span>-KES {discountAmt}</span></div>}
                  <div style={{ ...styles.priceRow, ...styles.priceTotal }}><span>Total</span><span>KES {total}</span></div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}><ArrowLeft size={18} /> Back</button>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span> : <><CheckCircle size={18} /> Confirm Booking</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {form.serviceType && (
            <div className="card" style={styles.sidebar}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#1B4332', marginBottom: 16 }}>Order Summary</h3>
              <div style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>
                <strong>{SERVICES.find(s => s.id === form.serviceType)?.name}</strong>
              </div>
              {selectedPkg && (
                <div style={{ fontSize: 14, color: '#374151', marginBottom: 16 }}>
                  {selectedPkg.name} Package
                </div>
              )}
              {subtotal > 0 && (
                <>
                  <div style={styles.priceRow}><span style={{ fontSize: 13 }}>Subtotal</span><span>KES {subtotal}</span></div>
                  <div style={styles.priceRow}><span style={{ fontSize: 13 }}>Delivery</span><span>KES {DELIVERY_FEE}</span></div>
                  {discountAmt > 0 && <div style={{ ...styles.priceRow, color: '#10B981', fontSize: 13 }}><span>Discount</span><span>-KES {discountAmt}</span></div>}
                  <div style={{ ...styles.priceRow, fontWeight: 700, fontSize: 16, borderTop: '2px solid #E5E7EB', paddingTop: 12, marginTop: 8 }}>
                    <span>Total</span><span style={{ color: '#2D6A4F' }}>KES {total}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: '#F8FAF8', minHeight: '100vh', padding: '40px 24px' },
  container: { maxWidth: 1000, margin: '0 auto' },
  header: { marginBottom: 32, textAlign: 'center' },
  title: { fontFamily: 'Playfair Display, serif', fontSize: 32, color: '#1B4332', marginBottom: 8 },
  progress: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 },
  progressStep: { display: 'flex', alignItems: 'center', gap: 8 },
  progressDot: { width: 36, height: 36, borderRadius: '50%', background: '#E5E7EB', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 },
  progressActive: { background: '#2D6A4F', color: 'white' },
  progressLine: { width: 60, height: 2, background: '#E5E7EB', margin: '0 8px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' },
  formArea: { minWidth: 0 },
  stepTitle: { fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#1B4332', marginBottom: 20 },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  serviceCard: { padding: 20, border: '2px solid #E5E7EB', borderRadius: 12, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' },
  serviceSelected: { border: '2px solid #2D6A4F', background: '#F0FDF4' },
  serviceIcon: { color: '#2D6A4F', display: 'flex', justifyContent: 'center', marginBottom: 10 },
  serviceName: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  serviceDesc: { fontSize: 12, color: '#6B7280' },
  packagesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  packageCard: { padding: 20, border: '2px solid #E5E7EB', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' },
  packageSelected: { border: '2px solid #2D6A4F', background: '#F0FDF4' },
  packageName: { fontWeight: 700, fontSize: 16, color: '#1B4332', marginBottom: 6 },
  packagePrice: { fontSize: 22, fontWeight: 700, color: '#2D6A4F', marginBottom: 4 },
  packageFeature: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151', marginTop: 4 },
  summaryGrid: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingBottom: 8, borderBottom: '1px solid #F3F4F6' },
  imageUploadArea: { display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' },
  imageUploadBtn: { width: 100, height: 100, border: '2px dashed #E5E7EB', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: '#6B7280', fontSize: 11 },
  imagePreviewGrid: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  imagePreview: { width: 100, height: 100, borderRadius: 12, overflow: 'hidden', position: 'relative', border: '1px solid #E5E7EB' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
  removeImgBtn: { position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  pricingBreakdown: { background: '#F8FAF8', borderRadius: 10, padding: 16 },
  priceRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 },
  priceTotal: { fontWeight: 700, fontSize: 18, borderTop: '2px solid #E5E7EB', paddingTop: 12, marginTop: 8 },
  sidebar: { width: 240, position: 'sticky', top: 80 },
  successPage: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0FDF4', padding: 24 },
  successCard: { maxWidth: 480, width: '100%', textAlign: 'center', padding: '48px 36px' },
  successIcon: { display: 'flex', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#1B4332', marginBottom: 8 },
  successOrderId: { background: '#D8F3DC', padding: '12px 20px', borderRadius: 10, fontSize: 16, marginBottom: 20, color: '#1B4332' },
  successDetails: { display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', background: '#F8FAF8', padding: 16, borderRadius: 10, marginBottom: 8 },
};
