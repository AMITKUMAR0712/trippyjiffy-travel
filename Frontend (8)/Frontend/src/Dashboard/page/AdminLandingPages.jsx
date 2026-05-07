import React, { useState, useEffect } from "react";
import { getAllLandingPagesFromAPI, upsertLandingPageAPI, deleteLandingPageAPI } from "../../utils/landingPageAPI";
import Style from "../Style/AdminLandingPages.module.scss";
import { toast } from "sonner";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaEye } from "react-icons/fa";
import axios from "axios";
import ImageUpload from "../Compontent/ImageUpload";

const AdminLandingPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [destinations, setDestinations] = useState({ india: [], asia: [] });
  const [allAvailableTours, setAllAvailableTours] = useState([]);


  // Form State
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [pageData, setPageData] = useState({});
  const [activeSection, setActiveSection] = useState("general");

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5005";

  useEffect(() => {
    fetchPages();
    fetchDestinations();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await getAllLandingPagesFromAPI();
      setPages(data || []);
    } catch (error) {
      toast.error("Failed to fetch landing pages");
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const [indiaRes, asiaRes, indiaToursRes, asiaToursRes, statesRes] = await Promise.all([
        axios.get(`${baseURL}/api/category-india/get`).catch(() => ({ data: [] })),
        axios.get(`${baseURL}/api/asia/get`).catch(() => ({ data: [] })),
        axios.get(`${baseURL}/api/tours/get`).catch(() => ({ data: [] })),
        axios.get(`${baseURL}/api/country/get`).catch(() => ({ data: { data: [] } })),
        axios.get(`${baseURL}/api/asiastate/get`).catch(() => ({ data: [] }))
      ]);
      
      setDestinations({
        india: indiaRes.data || [],
        asia: asiaRes.data || []
      });

      // Combine and format all tours for the dropdown
      const indiaTours = (indiaToursRes.data || []).map(t => ({ 
        id: t.id, 
        title: t.tour_name || t.title, 
        image: t.image || t.image_url, 
        type: 'india',
        link: `/tour/${t.id}`
      }));

      const asianStates = statesRes.data || [];
      const asiaTours = (asiaToursRes.data?.data || []).map(t => {
        const state = asianStates.find(s => Number(s.id) === Number(t.asiastate_id));
        const countryId = state ? (state.country_id || state.asia_id) : '0';
        const stateName = (t.title || "").toLowerCase().trim().replace(/\s+/g, "-");
        return { 
          id: t.id, 
          title: t.title, 
          image: t.image || t.image_url, 
          type: 'asia',
          link: `/country/${countryId}/${t.asiastate_id}/${stateName}`
        };
      });
      
      const combined = [...indiaTours, ...asiaTours];
      console.log("[DEBUG] All Available Tours Loaded:", combined.length);
      setAllAvailableTours(combined);
    } catch (error) {
      console.error("Error fetching destinations or tours:", error);
    }
  };



  const handleDestinationSelect = async (dest, type) => {
    const name = type === 'india' ? dest.region_name : dest.country_name;
    const newSlug = name.toLowerCase().trim().replace(/\s+/g, "-");
    setSlug(newSlug);
    setTitle(`${name} Tour`);
    
    // Auto-fill some basic data
    updateNestedData("hero.title", `${name} Signature Journey`);
    updateNestedData("hero.badge", "Premium Experience");

    // AUTO FETCH TOURS FOR RECOMMENDED SECTION
    try {
      if (type === 'india') {
        const res = await axios.get(`${baseURL}/api/tours/get`);
        const allTours = res.data || [];
        // Filter tours belonging to this state
        const filtered = allTours.filter(t => Number(t.state_id) === Number(dest.id));
        
        const mapped = filtered.map(t => ({
          title: t.tour_name || t.title,
          image: t.image || t.image_url || "",
          link: `/tour/${t.id}`
        }));

        if (mapped.length > 0) {
          updateNestedData("recommendedTours", mapped);
          toast.success(`Auto-fetched ${mapped.length} tours for ${name}`);
        } else {
          updateNestedData("recommendedTours", []);
          toast.info(`No specific tours found for ${name}, using defaults.`);
        }
      } else if (type === 'asia') {
        // Fetch Overseas/Asia tours
        const res = await axios.get(`${baseURL}/api/country/get`);
        const allTours = res.data?.data || [];
        
        // Find Asian states (circuits) belonging to this country
        const statesRes = await axios.get(`${baseURL}/api/asiastate/get`);
        const asianStates = statesRes.data || [];
        const countryStateIds = asianStates
          .filter(s => Number(s.country_id) === Number(dest.id))
          .map(s => Number(s.id));

        const filtered = allTours.filter(t => countryStateIds.includes(Number(t.asiastate_id)));

        const mapped = filtered.map(t => ({
          title: t.title,
          image: t.image || t.image_url || "",
          link: `/tour/${t.id}`
        }));

        if (mapped.length > 0) {
          updateNestedData("recommendedTours", mapped);
          toast.success(`Auto-fetched ${mapped.length} overseas tours for ${name}`);
        }
      }
    } catch (error) {
      console.error("Error auto-fetching tours:", error);
      toast.error("Failed to auto-fetch tours for this destination");
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setSlug(page.slug);
    setTitle(page.title);
    
    // Ensure all required fields exist to prevent form errors
    const data = page.data || {};
    if (!data.contact) data.contact = { phones: [""], email: "", address: "" };
    if (!data.hero) data.hero = { slides: [], title: "", subtitle: "" };
    if (!data.about) data.about = { heading: "", description: "", points: [] };
    
    setPageData(data);
    setShowEditor(true);
  };


  const handleCreate = () => {
    setEditingPage(null);
    setSlug("");
    setTitle("");
    setPageData({
      sections: ["hero", "recommended", "about", "highlights", "trending", "intro", "why-us", "testimonials", "certificates", "contact"],
      hero: { slides: [], title: "", subtitle: "", badge: "", ctaPrimary: "Enquire Now", ctaSecondary: "Call Now", ctaPhone: "" },
      recommendedTours: [],
      stats: [{ value: "10k+", label: "Happy Guests" }, { value: "4.9", label: "Rating" }],
      about: { sectionTitle: "About This Journey", heading: "Overview", description: "", points: [""] },
      highlights: [{ title: "", description: "" }],
      whyIntro: { eyebrow: "EXCELLENCE", heading: "Why Choose Us", description: "", images: [] },
      whyChooseUs: [{ title: "", description: "" }],
      theme: { primary: "#d35400", secondary: "#2c3e50", accent: "#f39c12" }
    });

    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!slug || !title) {
      toast.error("Slug and Title are required");
      return;
    }
    try {
      await upsertLandingPageAPI({ slug: slug.toLowerCase().replace(/\s+/g, "-"), title, data: pageData });
      toast.success("Landing page saved successfully");
      setShowEditor(false);
      fetchPages();
    } catch (error) {
      toast.error("Failed to save landing page");
    }
  };

  const handleDelete = async (id, pageTitle) => {
    console.log("[DEBUG] Starting direct deletion for:", id, pageTitle);
    
    if (!id) {
      alert("Error: Page ID is missing. Cannot delete.");
      return;
    }

    // Pro-Developer Move: Bypass the native confirm dialog which might be blocked
    try {
      toast.loading("Deleting page...", { id: "del-toast" });
      console.log("[DEBUG] Calling deleteLandingPageAPI with ID:", id);
      
      const res = await deleteLandingPageAPI(id);
      
      console.log("[DEBUG] Server Response:", res);
      alert(`Success! '${pageTitle}' has been removed.`);
      toast.success("Page deleted successfully", { id: "del-toast" });
      
      fetchPages(); // Refresh the list
    } catch (error) {
      console.error("[DEBUG] Deletion Failed:", error);
      alert("Delete Error: " + error.message);
      toast.error("Failed to delete page", { id: "del-toast" });
    }
  };




  const updateNestedData = (path, value) => {
    setPageData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleArrayUpdate = (path, index, value, isDelete = false) => {
    const keys = path.split('.');
    let current = { ...pageData };
    let target = current;
    for (let i = 0; i < keys.length - 1; i++) { target = target[keys[i]]; }
    const arrKey = keys[keys.length - 1];
    let newArr = [...(target[arrKey] || [])];
    if (isDelete) { newArr.splice(index, 1); } 
    else if (index === -1) { newArr.push(value); } 
    else { newArr[index] = value; }
    updateNestedData(path, newArr);
  };

  if (loading && !showEditor) return <div className={Style.loader}>Loading...</div>;

  return (
    <div className={Style.container}>
      <div className={Style.header}>
        <h1>Manage Landing Pages</h1>
        <button className={Style.createBtn} onClick={handleCreate}><FaPlus /> Create New Page</button>
      </div>

      {!showEditor ? (
        <div className={Style.grid}>
          {pages.map((p) => (
            <div key={p.id} className={Style.card}>
              <div className={Style.cardInfo}><h3>{p.title}</h3><p>/family-trips/{p.slug}</p></div>
              <div className={Style.cardActions}>
                <a href={`/family-trips/${p.slug}`} target="_blank" rel="noreferrer" className={Style.viewBtn}><FaEye /></a>
                <button onClick={() => handleEdit(p)} className={Style.editBtn}><FaEdit /></button>
                <button onClick={() => handleDelete(p.id, p.title)} className={Style.deleteBtn}><FaTrash /></button>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={Style.editor}>
          <div className={Style.editorHeader}>
            <h2>{editingPage ? `Editing: ${title}` : "Create New Page"}</h2>
            <div className={Style.editorActions}>
              <button onClick={handleSave} className={Style.saveBtn}><FaSave /> Save</button>
              <button onClick={() => setShowEditor(false)} className={Style.cancelBtn}><FaTimes /> Cancel</button>
            </div>
          </div>
          <div className={Style.editorBody}>
            <aside className={Style.editorSidebar}>
              {["general", "hero", "recommended", "intro", "about", "highlights", "why-us", "testimonials", "contact", "json"].map(s => (
                <button key={s} className={activeSection === s ? Style.active : ""} onClick={() => setActiveSection(s)}>{s.toUpperCase()}</button>
              ))}
            </aside>



            <main className={Style.editorContent}>
              {activeSection === "general" && (
                <div className={Style.formSection}>
                  <h3>Destination & Identity</h3>
                  <div className={Style.destGrid}>
                    <div className={Style.destCol}><label>India State</label>
                      <select onChange={(e) => { const d = destinations.india.find(x => x.id === Number(e.target.value)); if(d) handleDestinationSelect(d, 'india'); }}>
                        <option value="">-- Select --</option>{destinations.india.map(d => <option key={d.id} value={d.id}>{d.region_name}</option>)}
                      </select>
                    </div>
                    <div className={Style.destCol}><label>Asia Country</label>
                      <select onChange={(e) => { const d = destinations.asia.find(x => x.id === Number(e.target.value)); if(d) handleDestinationSelect(d, 'asia'); }}>
                        <option value="">-- Select --</option>{destinations.asia.map(d => <option key={d.id} value={d.id}>{d.country_name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={Style.formGrid}>
                    <div className={Style.formGroup}><label>Slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} disabled={!!editingPage} /></div>
                    <div className={Style.formGroup}><label>Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                  </div>
                </div>
              )}

              {activeSection === "hero" && (
                <div className={Style.formSection}>
                  <h3>Hero & Slides</h3>
                  <div className={Style.formGroup}><label>Title</label><input value={pageData.hero?.title || ""} onChange={(e) => updateNestedData("hero.title", e.target.value)} /></div>
                  <div className={Style.formGroup}><label>Subtitle</label><textarea value={pageData.hero?.subtitle || ""} onChange={(e) => updateNestedData("hero.subtitle", e.target.value)} /></div>
                  <ImageUpload label="Add Slide Image" onUploadSuccess={(url) => handleArrayUpdate("hero.slides", -1, url)} />
                  <div className={Style.previewGrid}>
                    {(pageData.hero?.slides || []).map((img, i) => (
                      <div key={i} className={Style.previewImgCard}>
                        <img src={img.startsWith('/') ? `${baseURL}${img}` : img} alt="" />
                        <button onClick={() => handleArrayUpdate("hero.slides", i, null, true)}>Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "recommended" && (
                <div className={Style.formSection}>
                  <h3>Recommended Tours</h3>
                  {(pageData.recommendedTours || []).map((t, i) => (
                    <div key={i} className={Style.arrayItem}>
                      <div className={Style.formGroup}>
                        <label>Select Tour</label>
                        <select 
                          value={t.id || ""} 
                          onChange={(e) => {
                            const selected = allAvailableTours.find(x => String(x.id) === e.target.value);
                            if (selected) {
                              let items = [...pageData.recommendedTours];
                              items[i] = { ...items[i], id: selected.id, title: selected.title, image: selected.image, link: selected.link };
                              updateNestedData("recommendedTours", items);
                            }
                          }}
                        >
                          <option value="">-- Choose Existing Tour --</option>
                          <optgroup label="India Tours">
                            {allAvailableTours.filter(x => x.type === 'india').map(x => <option key={x.id} value={x.id}>{x.title}</option>)}
                          </optgroup>
                          <optgroup label="Overseas Tours">
                            {allAvailableTours.filter(x => x.type === 'asia').map(x => <option key={x.id} value={x.id}>{x.title}</option>)}
                          </optgroup>
                        </select>
                      </div>
                      
                      <input placeholder="Manual Title Override" value={t.title} onChange={(e) => { let items = [...pageData.recommendedTours]; items[i].title = e.target.value; updateNestedData("recommendedTours", items); }} />
                      <ImageUpload label="Override Tour Image" currentImage={t.image} onUploadSuccess={(url) => { let items = [...pageData.recommendedTours]; items[i].image = url; updateNestedData("recommendedTours", items); }} />
                      
                      <button className={Style.removeBtn} onClick={() => handleArrayUpdate("recommendedTours", i, null, true)}>Remove</button>
                    </div>
                  ))}
                  <button className={Style.addBtn} onClick={() => handleArrayUpdate("recommendedTours", -1, { title: "", image: "", link: "" })}>+ Add New Recommended Item</button>
                </div>
              )}
              {activeSection === "intro" && (
                <div className={Style.formSection}>
                  <h3>Intro Section (Side-by-Side)</h3>
                  <div className={Style.formGroup}><label>Eyebrow Text</label><input value={pageData.intro?.eyebrow || ""} onChange={(e) => updateNestedData("intro.eyebrow", e.target.value)} placeholder="e.g. Explore, Discover, and Relax" /></div>
                  <div className={Style.formGroup}><label>Heading</label><input value={pageData.intro?.heading || ""} onChange={(e) => updateNestedData("intro.heading", e.target.value)} /></div>
                  <div className={Style.formGroup}><label>Description</label><textarea value={pageData.intro?.description || ""} onChange={(e) => updateNestedData("intro.description", e.target.value)} /></div>
                  <div className={Style.formGroup}><label>Button Text</label><input value={pageData.intro?.cta || "Contact Now"} onChange={(e) => updateNestedData("intro.cta", e.target.value)} /></div>
                  <div className={Style.formGroup}>
                    <label>Intro Image</label>
                    <ImageUpload currentImage={pageData.intro?.image} onUploadSuccess={(url) => updateNestedData("intro.image", url)} />
                  </div>
                </div>
              )}


              {activeSection === "about" && (
                <div className={Style.formSection}>
                  <h3>About This Journey</h3>
                  <div className={Style.formGroup}><label>Section Heading</label><input value={pageData.about?.heading || ""} onChange={(e) => updateNestedData("about.heading", e.target.value)} /></div>
                  <div className={Style.formGroup}><label>Description</label><textarea value={pageData.about?.description || ""} onChange={(e) => updateNestedData("about.description", e.target.value)} /></div>
                </div>
              )}

              {activeSection === "highlights" && (
                <div className={Style.formSection}>
                  <h3>Highlights</h3>
                  {(pageData.highlights || []).map((h, i) => (
                    <div key={i} className={Style.arrayItem}>
                      <input placeholder="Title" value={h.title} onChange={(e) => { let items = [...pageData.highlights]; items[i].title = e.target.value; updateNestedData("highlights", items); }} />
                      <textarea placeholder="Description" value={h.description} onChange={(e) => { let items = [...pageData.highlights]; items[i].description = e.target.value; updateNestedData("highlights", items); }} />
                      <button className={Style.removeBtn} onClick={() => handleArrayUpdate("highlights", i, null, true)}>Remove</button>
                    </div>
                  ))}
                  <button className={Style.addBtn} onClick={() => handleArrayUpdate("highlights", -1, { title: "", description: "" })}>+ Add Highlight</button>
                </div>
              )}

              {activeSection === "why-us" && (
                <div className={Style.formSection}>
                  <h3>Why Choose Us</h3>
                  <div className={Style.formGroup}><label>Heading</label><input value={pageData.whyIntro?.heading || ""} onChange={(e) => updateNestedData("whyIntro.heading", e.target.value)} /></div>
                  <div className={Style.formGroup}><label>Main Images (Select up to 3)</label>
                    <ImageUpload label="Add Image" onUploadSuccess={(url) => handleArrayUpdate("whyIntro.images", -1, url)} />
                    <div className={Style.previewGrid}>
                      {(pageData.whyIntro?.images || []).map((img, i) => (
                        <div key={i} className={Style.previewImgCard}>
                          <img src={img.startsWith('/') ? `${baseURL}${img}` : img} alt="" />
                          <button onClick={() => handleArrayUpdate("whyIntro.images", i, null, true)}>Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={Style.whyList}>
                    {(pageData.whyChooseUs || []).map((w, i) => (
                      <div key={i} className={Style.arrayItem}>
                        <input placeholder="Reason Title" value={w.title} onChange={(e) => { let items = [...pageData.whyChooseUs]; items[i].title = e.target.value; updateNestedData("whyChooseUs", items); }} />
                        <textarea placeholder="Description" value={w.description} onChange={(e) => { let items = [...pageData.whyChooseUs]; items[i].description = e.target.value; updateNestedData("whyChooseUs", items); }} />
                        <button className={Style.removeBtn} onClick={() => handleArrayUpdate("whyChooseUs", i, null, true)}>Remove</button>
                      </div>
                    ))}
                    <button className={Style.addBtn} onClick={() => handleArrayUpdate("whyChooseUs", -1, { title: "", description: "" })}>+ Add Reason</button>
                  </div>
                </div>
              )}
              {activeSection === "testimonials" && (
                <div className={Style.formSection}>
                  <h3>Testimonials & Reviews</h3>
                  <div className={Style.formGroup}><label>Section Title</label><input value={pageData.testimonialsTitle || ""} onChange={(e) => updateNestedData("testimonialsTitle", e.target.value)} /></div>
                  <div className={Style.formGroup}><label>Subtitle</label><input value={pageData.testimonialsSubtitle || ""} onChange={(e) => updateNestedData("testimonialsSubtitle", e.target.value)} /></div>
                  <p className={Style.infoHint}>This section automatically pulls the latest 5-star Google Reviews.</p>
                </div>
              )}

              {activeSection === "contact" && (
                <div className={Style.formSection}>
                  <h3>Final Contact Section (CTA)</h3>
                  <div className={Style.formGroup}><label>Section Heading</label><input value={pageData.contact?.heading || ""} onChange={(e) => updateNestedData("contact.heading", e.target.value)} placeholder="Ready to Start Your Journey?" /></div>
                  <div className={Style.formGroup}><label>Section Subtitle</label><input value={pageData.contact?.subtitle || ""} onChange={(e) => updateNestedData("contact.subtitle", e.target.value)} placeholder="Our experts are here to help..." /></div>
                  
                  <div className={Style.formGroup}><label>Phone Numbers (Comma separated)</label>
                    <input 
                      value={(pageData.contact?.phones || []).join(", ")} 
                      onChange={(e) => updateNestedData("contact.phones", e.target.value.split(",").map(p => p.trim()))} 
                      placeholder="+91 95821 54406, +91 99905 45000"
                    />
                  </div>
                  
                  <div className={Style.formGroup}><label>Email Address</label><input value={pageData.contact?.email || ""} onChange={(e) => updateNestedData("contact.email", e.target.value)} placeholder="travelqueries@trippyjiffy.com" /></div>
                  <div className={Style.formGroup}><label>Office Address</label><input value={pageData.contact?.address || ""} onChange={(e) => updateNestedData("contact.address", e.target.value)} placeholder="TrippyJiffy, New Delhi, India" /></div>
                  <div className={Style.formGroup}><label>Form Title</label><input value={pageData.contact?.formTitle || ""} onChange={(e) => updateNestedData("contact.formTitle", e.target.value)} placeholder="Get a Free Quote" /></div>
                </div>
              )}


              {activeSection === "json" && (
                <div className={Style.formSection}>
                  <h3>Advanced JSON</h3>
                  <textarea className={Style.jsonArea} value={JSON.stringify(pageData, null, 2)} onChange={(e) => { try { setPageData(JSON.parse(e.target.value)); } catch(err) {} }} />
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLandingPages;
