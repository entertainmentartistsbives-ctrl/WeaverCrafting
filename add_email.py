import os

files = ['index.html', 'contact.html']

old_contact_detail = """        <div class="contact-detail">
          <div class="contact-icon">🕐</div>
          <div>
            <div class="contact-detail-label">Working Hours</div>
            <div class="contact-detail-value">Monday – Saturday: 9am – 7pm<br>Sunday: By appointment</div>
          </div>
        </div>"""

new_contact_detail = """        <div class="contact-detail">
          <div class="contact-icon">🕐</div>
          <div>
            <div class="contact-detail-label">Working Hours</div>
            <div class="contact-detail-value">Monday – Saturday: 9am – 7pm<br>Sunday: By appointment</div>
          </div>
        </div>
        <div class="contact-detail">
          <div class="contact-icon">✉️</div>
          <div>
            <div class="contact-detail-label">Email</div>
            <div class="contact-detail-value"><a href="mailto:craftersofa974263@gmail.com" style="color:inherit;text-decoration:none;">craftersofa974263@gmail.com</a></div>
          </div>
        </div>"""

old_wa_numbers = """      <div class="wa-numbers">
        <a href="tel:+919742630886" class="wa-num">📞 +91 97426 30886</a>
        <a href="tel:+918881423496" class="wa-num">📞 +91 88814 23496</div>
      </div>"""

new_wa_numbers = """      <div class="wa-numbers">
        <a href="tel:+919742630886" class="wa-num">📞 +91 97426 30886</a>
        <a href="tel:+918881423496" class="wa-num">📞 +91 88814 23496</a>
        <a href="mailto:craftersofa974263@gmail.com" class="wa-num">✉️ Email Us</a>
      </div>"""

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace(old_contact_detail, new_contact_detail)
    content = content.replace(old_wa_numbers, new_wa_numbers)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
print("Updated successfully")
