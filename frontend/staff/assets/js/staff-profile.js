document.addEventListener('DOMContentLoaded', function() {
    
    // Tab Navigation
    const profileTabs = document.querySelectorAll('.profile-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            profileTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Avatar Upload
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const staffProfileAvatar = document.getElementById('staffProfileAvatar');

    if (changeAvatarBtn && avatarInput) {
        changeAvatarBtn.addEventListener('click', () => avatarInput.click());

        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    staffProfileAvatar.src = e.target.result;
                    StaffUtils.showToast('Profile photo updated!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Forms
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Saving...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Save Changes';
                btn.disabled = false;
                StaffUtils.showToast('Personal information updated!', 'success');
            }, 1500);
        });
    }

    const professionalForm = document.getElementById('professionalForm');
    if (professionalForm) {
        professionalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            StaffUtils.showToast('Professional details saved!', 'success');
        });
    }

    const accountForm = document.getElementById('accountForm');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            StaffUtils.showToast('Account settings saved!', 'success');
        });
    }

    // Password Form
    const passwordForm = document.getElementById('passwordForm');
    const newPasswordInput = document.getElementById('newPasswordInput');
    
    if (passwordForm && newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.querySelector('.strength-bar-fill');
            const strengthText = document.querySelector('.strength-text span');
            
            if (password.length === 0) {
                strengthBar.style.width = '0%';
                strengthBar.className = 'strength-bar-fill';
                strengthText.textContent = '-';
                return;
            }
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[a-z]+/)) strength++;
            if (password.match(/[A-Z]+/)) strength++;
            if (password.match(/[0-9]+/)) strength++;
            if (password.match(/[$@#&!]+/)) strength++;
            
            strengthBar.classList.remove('weak', 'medium', 'strong');
            
            if (strength <= 2) {
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak';
                strengthText.style.color = 'var(--danger)';
            } else if (strength <= 4) {
                strengthBar.classList.add('medium');
                strengthText.textContent = 'Medium';
                strengthText.style.color = 'var(--warning)';
            } else {
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong';
                strengthText.style.color = 'var(--success)';
            }
        });

        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            StaffUtils.showToast('Password updated successfully!', 'success');
            this.reset();
            document.querySelector('.strength-bar-fill').style.width = '0%';
            document.querySelector('.strength-text span').textContent = '-';
        });
    }

    // Skills
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillInput = document.getElementById('skillInput');
    
    if (addSkillBtn && skillInput) {
        addSkillBtn.addEventListener('click', function() {
            const skill = skillInput.value.trim();
            if (skill) {
                const skillsContainer = document.querySelector('.skills-tags');
                const newSkill = document.createElement('span');
                newSkill.className = 'skill-tag';
                newSkill.innerHTML = `${skill} <i class="bi bi-x"></i>`;
                skillsContainer.appendChild(newSkill);
                
                newSkill.querySelector('i').addEventListener('click', function() {
                    newSkill.remove();
                });
                
                skillInput.value = '';
                StaffUtils.showToast('Skill added!', 'success');
            }
        });
        
        skillInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkillBtn.click();
            }
        });
    }

    // Remove Skill
    document.querySelectorAll('.skill-tag i').forEach(icon => {
        icon.addEventListener('click', function() {
            this.closest('.skill-tag').remove();
        });
    });

    console.log('%c👤 Staff Profile Loaded', 'color: #6366f1; font-size: 16px; font-weight: bold;');
});