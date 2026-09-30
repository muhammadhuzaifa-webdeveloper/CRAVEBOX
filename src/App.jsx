import MainRouter from "./routes/MainRouter";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Platform Route Channels handles the view layout dynamically */}
      <MainRouter />
    </div>
  );
}

export default App;