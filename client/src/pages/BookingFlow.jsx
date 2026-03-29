{/* ✅ STEP 5: PAYMENT + QR + CLOUDINARY UPLOAD */}
{step === 5 && (
  <div className="max-w-2xl mx-auto space-y-8">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
      💳 Secure Your ₱1,000 Reservation
    </h2>
    
    {/* Package Summary */}
    <div className="p-8 bg-gradient-to-br from-black/50 to-gray-900/50 border-2 border-cyan-400/30 rounded-3xl">
      <h3 className="text-2xl font-bold mb-4 text-cyan-400">Your Package:</h3>
      <div className="text-xl">
        📦 Package {packageSelected?.type} – ₱{packageSelected?.price?.toLocaleString()}
      </div>
    </div>

    {/* ✅ GCASH QR CODE - VITE PUBLIC PATH */}
    <div className="text-center p-8 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-2 border-emerald-400/30 rounded-3xl">
      <div className="text-2xl font-bold mb-6 text-emerald-400 flex items-center justify-center">
        📱 Scan QR Code → Pay ₱1,000
      </div>
      
      {/* ✅ CORRECT VITE PUBLIC PATH */}
      <div className="bg-white/20 p-8 rounded-3xl border-4 border-white/30 mx-auto max-w-md backdrop-blur-xl shadow-2xl">
        <img 
          src="/IMG_7162.jpg"  // ✅ Vite serves from public/ automatically
          alt="Storyline Studios GCash QR Code"
          className="w-72 h-72 mx-auto rounded-2xl shadow-xl border-4 border-white/50 object-contain"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/288x288/00d4ff/000000?text=GCash+QR';
            console.log('QR fallback loaded');
          }}
        />
      </div>
      
      <div className="mt-6 p-4 bg-black/60 rounded-2xl border border-emerald-400/50">
        <div className="font-bold text-lg text-emerald-300 mb-2">Storyline Studios</div>
        <div className="text-sm text-gray-300">09286675952</div>
        <div className="text-xs text-gray-400 mt-2">Reservation Fee: ₱1,000</div>
      </div>
    </div>

    {/* ✅ RECEIPT UPLOAD */}
    <div className="p-8 bg-gradient-to-br from-gray-900/50 to-black/50 border-2 border-purple-500/30 rounded-3xl">
      <label className="block text-2xl font-bold mb-6 text-purple-400 text-center">
        📸 Upload Your Payment Receipt
      </label>
      
      <div className="relative">
        <input
          id="receipt-upload"
          type="file"
          accept="image/jpeg,image/png,image/heic"
          onChange={handleReceiptUpload}
          className="w-full p-8 text-xl bg-black/60 border-4 border-dashed border-purple-500/50 rounded-3xl file:mr-6 file:py-4 file:px-10 file:rounded-2xl file:border-0 file:font-bold file:bg-gradient-to-r file:from-purple-500 file:to-purple-600 file:text-lg file:text-white file:shadow-lg hover:file:shadow-xl hover:file:from-purple-600 hover:file:to-purple-700 cursor-pointer transition-all duration-300 focus:outline-none focus:border-purple-400"
          required
        />
        
        {receiptFile && (
          <div className="mt-6 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50 rounded-2xl animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-lg text-green-400">✅ Receipt Ready</div>
                <div className="text-green-300">{receiptFile.name}</div>
                <div className="text-sm text-green-200">Size: {(receiptFile.size / 1024).toFixed(1)} KB</div>
              </div>
              <button
                type="button"
                onClick={() => setReceiptFile(null)}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={prevStep}
        className="flex-1 px-12 py-6 bg-gray-800/60 hover:bg-gray-700/80 border-2 border-gray-600/50 rounded-3xl font-bold text-xl transition-all duration-300 hover:scale-105"
      >
        ← Back to Packages
      </button>
      <button
        onClick={submitPayment}
        disabled={!receiptFile || isUploading}
        className="flex-1 px-12 py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-emerald-400/50 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
      >
        {isUploading ? (
          <>
            <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3" />
            Verifying Payment...
          </>
        ) : (
          '✅ Confirm & Reserve Slot'
        )}
      </button>
    </div>

    {/* Success Message */}
    {isUploading && (
      <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 rounded-3xl text-center">
        <div className="text-lg font-bold text-blue-300 mb-2">⏳ Processing...</div>
        <div className="text-blue-200">Receipt uploading to Cloudinary → Saving to database → Slot reserved!</div>
      </div>
    )}
  </div>
)}
