// PHẦN MÃ MỚI: Đặt lại trạng thái sách khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các trang bên phải
    const pagesOnRight = document.querySelectorAll('.book-page.page-right');
    const totalPages = pagesOnRight.length;

    // Đảm bảo sách luôn đóng khi tải trang
    // Bằng cách xóa class 'turn' và đặt lại z-index
    setTimeout(() => {
        pagesOnRight.forEach((page, index) => {
            page.classList.remove('turn');
            // Đặt z-index để các trang xếp chồng đúng thứ tự
            // Trang đầu tiên (index 0) sẽ có z-index cao nhất
            setTimeout(() => {
                page.style.zIndex = totalPages - index;
            }, 100 * index);
        });
    }, 100);
});

// Mã xử lý nút lật trang trước/sau
const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

pageTurnBtn.forEach((el, index) => {
    el.onclick = () => {
        const pageTurnId = el.getAttribute('data-page');
        const pageTurn = document.getElementById(pageTurnId);

        if (pageTurn.classList.contains('turn')) {
            pageTurn.classList.remove('turn');
            setTimeout(() => {
                // Giảm z-index khi lật về trang trước
                pageTurn.style.zIndex = 20 - index;
            }, 500);
        } else {
            pageTurn.classList.add('turn');
            setTimeout(() => {
                // Tăng z-index khi lật sang trang mới
                pageTurn.style.zIndex = 20 + index;
            }, 500);
        }
    };
});

// Mã xử lý nút "Contact Me" (lật đến trang cuối)
const pages = document.querySelectorAll('.book-page.page-right');
const contactMeBtn = document.querySelector('.btn.contact-me');

contactMeBtn.onclick = () => {
    pages.forEach((page, index) => {
        setTimeout(() => {
            page.classList.add('turn');
            setTimeout(() => {
                page.style.zIndex = 20 + index;
            }, 500);
        }, (index + 1) * 200 + 100);
    });
};

// Mã xử lý nút "Back to profile" (lật ngược về trang đầu)
const backProfileBtn = document.querySelector('.back-profile');

backProfileBtn.onclick = () => {
    const total = pages.length;
    pages.forEach((page, i) => {
        setTimeout(() => {
            const index = total - 1 - i;
            pages[index].classList.remove('turn');
            setTimeout(() => {
                // Đặt z-index theo thứ tự ngược lại để xếp chồng đúng
                pages[index].style.zIndex = 10 + i;
            }, 500);
        }, (i + 1) * 200 + 100);
    });
};