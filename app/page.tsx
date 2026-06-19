"use client";

import React, { useState, useEffect } from "react";

export default function SchedulePage() {
  // 1. スケジュールデータを管理する状態（最初は空っぽにしておきます）
  const [schedules, setSchedules] = useState<{
    id: number;
    date: string;
    time: string;
    name: string;
    location: string;
    vehicle: string;
    action: string;
    color: string;
  }[]>([]);

  // 2. 入力フォームの状態
  const [formData, setFormData] = useState({
    date: "2026-06-19",
    time: "10:00",
    name: "平",
    location: "",
    vehicle: "",
    action: "",
    colorType: "加工"
  });

  // 3. 絞り込み用の状態
  const [selectedName, setSelectedName] = useState("全員");

  // 【新機能】アプリが開いた瞬間に、パソコンに保存されているデータを自動で読み込む
  useEffect(() => {
    const savedSchedules = localStorage.getItem("company-schedules");
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    } else {
      // 最初だけテストデータを2つ入れてあげる
      const defaultData = [
        { id: 1, date: "2026-06-19", time: "08:00", name: "平", location: "本・羽", vehicle: "468", action: "移動", color: "bg-orange-200 text-orange-950" },
        { id: 2, date: "2026-06-19", time: "09:00", name: "平", location: "羽島ファクトリー", vehicle: "", action: "ウレタン張加工", color: "bg-blue-100 text-blue-950" },
      ];
      setSchedules(defaultData);
      localStorage.setItem("company-schedules", JSON.stringify(defaultData));
    }
  }, []);

  // 4. 追加ボタンを押したときの処理
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.action) {
      alert("場所と業務内容を入力してください！");
      return;
    }

    let finalColor = "bg-gray-100 text-gray-900";
    if (formData.colorType === "移動") finalColor = "bg-orange-200 text-orange-950";
    if (formData.colorType === "加工") finalColor = "bg-blue-100 text-blue-950";
    if (formData.colorType === "デスクワーク") finalColor = "bg-green-100 text-green-950";

    const newSchedule = {
      id: Date.now(),
      date: formData.date,
      time: formData.time,
      name: formData.name,
      location: formData.location,
      vehicle: formData.vehicle,
      action: formData.action,
      color: finalColor
    };

    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    
    // 【新機能】追加したデータをパソコン（ブラウザ）に保存する
    localStorage.setItem("company-schedules", JSON.stringify(updatedSchedules));

    setFormData({ ...formData, location: "", vehicle: "", action: "" });
  };

  // 【新機能】予定を削除する処理
  const handleDelete = (id: number) => {
    if (confirm("この予定を削除してもよろしいですか？")) {
      const updatedSchedules = schedules.filter(s => s.id !== id);
      setSchedules(updatedSchedules);
      // 保存データを更新する
      localStorage.setItem("company-schedules", JSON.stringify(updatedSchedules));
    }
  };

  const filteredSchedules = schedules.filter((item) => {
    if (selectedName === "全員") return true;
    return item.name === selectedName;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-800">
      <h1 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">📅 社内スケジュール管理アプリ（保存・削除機能付き）</h1>

      {/* 入力フォームエリア */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-3">➕ 新しい予定を追加する</h2>
        <form onSubmit={handleAddSchedule} className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7 items-end">
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1">日付</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-1.5 bg-gray-50" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1">時間</label>
            <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-1.5 bg-gray-50" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1">氏名</label>
            <select value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-1.5 bg-gray-50">
              <option value="平">平</option>
              <option value="鈴木">鈴木</option>
              <option value="田中">田中</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1">場所</label>
            <input type="text" placeholder="羽島F、本社など" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-1.5 bg-white" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1">車両番号 (任意)</label>
            <input type="text" placeholder="468 など" value={formData.vehicle} onChange={(e) => setFormData({...formData, vehicle: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-1.5 bg-white" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-1">業務内容</label>
            <div className="flex gap-1">
              <input type="text" placeholder="ウレタン張など" value={formData.action} onChange={(e) => setFormData({...formData, action: e.target.value})} className="w-full text-sm border border-gray-300 rounded p-1.5 bg-white" />
              <select value={formData.colorType} onChange={(e) => setFormData({...formData, colorType: e.target.value})} className="text-xs border border-gray-300 rounded p-1 bg-gray-50">
                <option value="加工">加工(青)</option>
                <option value="移動">移動(橙)</option>
                <option value="デスクワーク">事務(緑)</option>
              </select>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded shadow transition">
              予定を追加
            </button>
          </div>
        </form>
      </div>

      {/* 表示切替ボタン */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-gray-500">表示切替:</span>
        <button onClick={() => setSelectedName("全員")} className={`rounded text-xs font-semibold px-3 py-1.5 shadow-sm border transition ${selectedName === "全員" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>全員</button>
        <button onClick={() => setSelectedName("平")} className={`rounded text-xs font-semibold px-3 py-1.5 shadow-sm border transition ${selectedName === "平" ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>平さん</button>
        <button onClick={() => setSelectedName("鈴木")} className={`rounded text-xs font-semibold px-3 py-1.5 shadow-sm border transition ${selectedName === "鈴木" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}>鈴木さん</button>
      </div>

      {/* スケジュール表示エリア */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold border-b-2 border-blue-500 pb-1 text-blue-700">🗓️ 6/19 (金) の予定一覧</h2>
          <div className="space-y-2">
            {filteredSchedules.filter(s => s.date === "2026-06-19").map(item => (
              <div key={item.id} className={`p-3 rounded border border-gray-200/60 ${item.color} shadow-sm relative group`}>
                <div className="text-xs font-semibold opacity-75">{item.time}</div>
                <div className="text-base font-bold mt-0.5">{item.name}</div>
                <div className="text-xs mt-1">
                  📍 {item.location} {item.vehicle && `🚗 (${item.vehicle})`}
                </div>
                <div className="text-xs font-bold mt-1.5 bg-white/60 px-2 py-0.5 rounded inline-block">
                  🛠️ {item.action}
                </div>
                
                {/* 【新機能】カードの右上に削除用の「×」ボタンを配置（マウスを乗せるかタップで表示） */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 font-bold text-sm px-1.5 py-0.5 rounded hover:bg-black/5"
                  title="削除"
                >
                  ✕
                </button>
              </div>
            ))}
            {filteredSchedules.filter(s => s.date === "2026-06-19").length === 0 && (
              <div className="text-sm text-gray-400 italic text-center py-6">この日の予定はありません</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}