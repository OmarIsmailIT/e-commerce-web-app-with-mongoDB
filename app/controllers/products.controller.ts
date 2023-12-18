import { Request, Response } from "express";
import Brand from "../models/brands.model";
import Category from "../models/category.model";
import Product from "../models/products.model";
import Reviews from "../models/reviews.model";

export const list = async (req: Request, res: Response) => {
  try {
    const resultsPerPage = parseInt(req.query.per_page as string, 10) || 12;
    const page = parseInt(req.query.page as string, 10) || 1;

    const { category, brand, handpicked, new_arrival, search_term } = req.query;

    let whereClause: any = {}; // Define a base where clause

    // Handle 'category' query parameter
    if (category) {
      const categoryName = req.query.category as string;
      const categorySearch = await Category.findOne({
        name: { $regex: new RegExp(categoryName, "i") },
      });

      if (categorySearch) {
        whereClause = {
          ...whereClause,
          category_Id: categorySearch._id,
        };
      }
    }

    // Handle 'brand' query parameter
    if (brand) {
      const brandName = req.query.brand as string;
      const brandSearch = await Brand.findOne({
        name: { $regex: new RegExp(brandName, "i") },
      });

      if (brandSearch) {
        whereClause = {
          ...whereClause,
          brand_Id: brandSearch._id,
        };
      }
    }

    // Handle 'handpicked' query parameter
    if (handpicked === "true") {
      whereClause = {
        ...whereClause,
        price: { $lt: 100 },
        rate: { $gt: 4.5 },
      };
    }

    // Handle 'new_arrival' query parameter
    if (new_arrival === "true") {
      const currentDate = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

      whereClause = {
        ...whereClause,
        createdAt: { $gt: threeMonthsAgo, $lt: currentDate },
      };
    }

    // Handle 'search_term' query parameter for both brand and product names
    if (search_term) {
      const search_termName = req.query.search_term as string;
      const brandSearch = await Brand.findOne({
        name: { $regex: new RegExp(search_termName, "i") },
      });

      if (brandSearch) {
        // If it's a brand search, send products in that brand
        whereClause = {
          ...whereClause,
          brand_Id: brandSearch._id,
        };
      } else {
        // Otherwise, search for products with a name containing the search term
        whereClause = {
          ...whereClause,
          name: { $regex: new RegExp(search_termName, "i") },
        };
      }
    }

    const rows = await Product.find(whereClause)
      .skip((page - 1) * resultsPerPage)
      .limit(resultsPerPage);

    const count = await Product.countDocuments(whereClause);

    const totalPages = Math.ceil(count / resultsPerPage);
    const productsWithReviewCounts = [];

    for (const product of rows) {
      const reviewCount = await Reviews.countDocuments({
        product_Id: product._id,
      });

      productsWithReviewCounts.push({
        ...product.toJSON(),
        ratingCount: reviewCount,
      });
    }

    res.status(200).json({
      results: productsWithReviewCounts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        resultsPerPage: resultsPerPage,
        totalResults: count,
      },
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
